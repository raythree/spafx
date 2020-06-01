import React from 'react';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';

export default function() {
  return (
    <Box>
      <Box component="span">
        <Link to="/page1">Page One</Link>
      </Box>
      <Box component="span" marginLeft="1em">
        <Link to="/page2">Page Two</Link>
      </Box>
    </Box>
  );
}
