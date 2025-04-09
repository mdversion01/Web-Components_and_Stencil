import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'UdemyWCCourse',
  outputTargets:[
    {
      type: 'dist'
    },
    // Below is used when building an entire Stencil app
    // {
    //   type: 'www',
    //   serviceWorker: null
    // }
  ]
  // ,
  // bundles: []
};
