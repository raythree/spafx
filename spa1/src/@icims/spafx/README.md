# ICIMS SPA Framework

**NOTE** This is a prototype / scratchpad for getting the API right. 

Utility framework for SPA to SPA interactions. Provides methods for `redirecting` to (or `calling`) other `target` SPAs that provide reusable functionality. A `target` SPA can transparently redirect to other SPAs, and can provide return values to `calling` SPAs. Functions are provided to support:

* Call a `target` SPA, and pass parameters and data.
* A `calling` SPA can check if it just returned from another SPA, and access to any returned data.
* A `target` SPA can check if was invoked by a calling SPA, and get access any input data.
* A `target` SPA can redirect back to a calling SPA, and pass optional data back to it. 

SPAs that call other SPAs or that export reusable functions should check for these states a load time, and initialize their Redux state accordingly.

## Example

The Profile SPA uses redux-router to render views for managing user profiles, including:

```
/profile/search     - search profiles, display result lists with click to edit or view buttons
/profile/:id/view   - view a profile
/profile/:id/edit   - edit an existing profile
/profile/:id/new    - create a new profile
```

Some of these routes accept URL parameters, such as sort or filter params for the list view, or options to only show certain fields for the edit view. 

To allow other SPAs to reuse some specific functionality, it provides and documents usage for these routes:

```
/profile/export/search     - search profiles, display result lists with click to edit or view buttons
/profile/export/:id/view   - view a single profile
/profile/export/:id/edit   - edit a single profile
/profile/export/browse     - Similar to view, but also accepts an ordered list of IDs, a `startIndex`, and displays next/previous buttons. Returns the `endIndex`.
```

Exported routes may usually mirror regular routes, but *should always use URLs that explicitly mark them as being exported*. Internally they can render the same views as the "local" versions, or they can add or omit certain components where there are differences between the two modes. 

Note that the `/profile/export/browse` route is NOT used locally but allows the calling SPA to reuse the `view` profile by passing ordered list of IDs and `startIndex` (default = 0) and adding next/previous buttons. When it redirects back to the calling SPA it returns the index of the last viewed profile as `lastIndex`. 

## Calling Another SPA

When calling another SPA, the following optional and required parameters are:

* url       - The URL of the SPA. Required.
* backUrl   - The return URL. Optional (default = current browser URL)
* qparams   - Object containing query parameters. Optional (default = {})
* data      - Object containing data to pass in addition to query params. Optional. (default = null. Max size of data = 6 mb)
* state     - Any state to be saved in between invocations. This will be available in the response object under the `state` key.

To call another SPA use the `createRequest` method. This returns a request object that you can use this to create navigation links in advance using the `link` method (to add to link tags, for example), or you invoke the `navigate` method to pass in query parameters and data and perform the redirection. 

**NOTE**: If you need to pass data or state outside of query parameters, you cannot generate links in advance and must use the `navigate` method. Passing data in this way uses session storage that needs to be cleared after navigation. 

### Examples

```js
import { createRequest } from '@icims/spafx';

// examples that create links in advance

let link;
// create a link that will redirect back to the current URL
link = createRequest(targetSpaUrl).link();

// create a link that will redirect back another page
link = createRequest(targetSpaUrl, someLocalUrl).link();

// create a link that has some query params
const params = {id: 1234}
const targetSpaUrl = '/spa2';
link = createRequest(targetSpaUrl).link(params); // "/spa2?id=1234"

// examples that navigate, using query parameters and optional data
const data = getSomeData(); 

createRequest(targetSpaUrl).navigate(); // redirect
createRequest(targetSpaUrl).navigate(params); // redirect with query params
createRequest(targetSpaUrl).navigate(params, data, state); // redirect with params, data, and state
createRequest(targetSpaUrl).navigate(null, data); // redirect with just data
createRequest(targetSpaUrl).navigate(null, data, state); // redirect with data and state
createRequest(targetSpaUrl).navigate(null, null, state); // redirect with just state

```

The `data` property will be passed to the target SPA in the inbound request object. The `state` property will be available in to the invoking SPA in the response object (see below).

## Checking for Responses

If you need to process a response from another SPA, you can use the `getResponse` method to check if a response was received. This will return `null` if no requests were made, otherswise it be an object, possibly empty. If `response.error` is set, it means the call failed and the caller can check `response.error.code` and `response.error.message`. Any other keys in the response object are return values from the called SPA, and `response.data` may also contain larger response data. If you provided any state in the outbound request it will be available as `response.state`. 

```js
import { getResponse } from '@icims/spafx';

// during SPA initialization

const response = getResponse();

if (response) {
  // returning from a request
  if (response.error) {
    // check and possibly display an error condition
  }  
  // process any response values or response.data
} 
```

## Checking for inbound Requests

If a SPA exposes any reusable views it should check for requests during initialization using the `getResponse` method. A non-`null` return indicates an inbound request. The returned object will have a `returnUrl` property with the URL to redirect back, and otionally a `data` property if the calling SPA passed any data. 

```js
import { getRequest } from '@icims/spafx';

// during initialization

const request = getRequest();
if (request) {
  // inbound request from another SPA, access request.backUrl and optionally request.data 
}
```

## Redirecting back to the calling SPA

The request object returned by `getRequest` has methods `link` and `navigate` for navigating back to the calling SPA, similar to `createRequest`. If returning values that can be handled by URL parameters either method can be used. If passing larger data back then the navigate method must be used:

```js
import { createResponse } from '@icims/spafx';

let link;

// create a back link for the Close or Back button
link = request.createResponse().link();

// create a link and return values via URL params
const params = {message: 'hello'};
link = request.createResponse(params).link();

// return using navigate, with optional data
const data = getSomeData(); 

request.createResponse().navigate(); // redirect back
request.createResponse().navigate(params); // redirect with query params
request.createResponse().navigate(params, data); // redirect with params and data
request.createResponse().navigate(null, data); // redirect with just data
```

## Redirecting back with errors

If there are errors with the request, the invoked SPA can use the `createErrorResponse` method of the `request` object. Similar to `createResponse`, the returned object has `link` and `navigate` methods. The `link` method might be used to display a message to the user with a Back button. A return code is required, and a message is optional:

```js
const backLink = request.createErrorResponse(403).link();

request.createErrorResponse(400, 'unrecognized parameter').navigate();
```


## Framework URL parameters and sessionStorage

The framework uses URL parameters for passing data between SPAs, outside of any URL parameters normally used by the calling and called SPAs. These values will be prefixed by `fw_` which is a reserved prefix. 

For inbound requests the `backUrl` will often be the only parameter identifying this as a request:

```js
// Assume the current browser URL is /recruit/candidate/1234 and the
// recruit SPA invokes the profile SPA to display a basic user profile

const link = createRequest('/profile/basic/view/1234').link();

// link = /profile/basic/view/1234?fw_back=/recruit/candidate/1234 
```

Likewise, when an invoked SPA redirects back with response parameters, a return link will have `fw_` prefixed parameters carrying the response parameters. 

Any data that can't be passed via the URL will use `sessionStorage`, but this is an implementation detail of the framework. Request data will be stored under a key that identifies the SPA. For example:

```js
// recruit SPA calling the profile SPA with data

createRequest(targetSpaUrl).navigate(null, data); // redirect with just data

// at this point, sessionStorage will have a key indicating request input data 
// for the profile SPA, like:

// profile.request = data
```

After the profile SPA calls `getRequest`, the sessionStorage key will be cleared. Likewise, if the profile SPA redirects back to the recruit SPA with response data, a sessionStorage key will be created:

```
recruit.response = { response data }
```
And this key will be cleared when the recruit SPA calls `getResponse`.
