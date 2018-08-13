// metalsmith configuration script.
import Metalsmith from 'metalsmith'
import markdown from 'metalsmith-markdownit'
import layouts from 'metalsmith-layouts'
import assets from 'metalsmith-assets'
import fingerprint from 'metalsmith-fingerprint-ignore'
import contentful from 'contentful-metalsmith'

import paths from '../config/paths'
import { StatisticsPlugin } from './metalsmith-helpers'

const __PROD__ = process.env.NODE_ENV === 'production'

export default new Metalsmith(paths.projectRoot)
  .clean(__PROD__)
  .source(paths.metalsmithSource)
  .destination(paths.metalsmithDestination)
  .use(assets({
    source: './dist/assets',
    destination: './assets'
  }))
  .use(assets({
    source: './dist/fonts',
    destination: './fonts'
  }))
  .use(contentful({
    space_id: 'xh00p26p24lx',
    access_token: '3e43e1303805449f8c899fa0dca71b09722b0473749df546ee0223e59712c3c0'
  }))
  .use(fingerprint({ pattern: 'assets/page.css' }))
  .use(fingerprint({ pattern: 'assets/immediate.js' }))
  .use(fingerprint({ pattern: 'assets/page.js' }))
  .use(markdown({
    html: true
  }))
  .use(layouts({
    engine: 'handlebars',
    default: 'default.html',
    partials: {
      header: 'partials/header',
      nav: 'partials/nav',
      section: 'partials/section',
      footer: 'partials/footer',
      endscripts: 'partials/endscripts'
    },
    // to avoid conflics, we match only html files
    pattern: '**/*.html',
    helpers: {
      // Neat little handlebars debugger
      // Usage example: <pre>{{debug this}}</pre>
      debug: (obj) => JSON.stringify(obj, null, 2)
    }
  }))
  // Display statistics of generated files at the end
  .use(StatisticsPlugin())
  // Import above and use the debug plugin to get more detailed information
  // .use(DebugPlugin())
