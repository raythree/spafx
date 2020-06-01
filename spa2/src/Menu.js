import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

export default function() {
  return (
    <Box>
      <Box component="span">
        <Link href="page1">Page One</Link>
      </Box>
      <Box component="span" marginLeft="1em">
        <Link href="page2">Page Two</Link>
      </Box>
    </Box>
  );
}
