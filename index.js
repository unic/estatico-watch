const defaults = {
  usePolling: false
}

// In order for gulp-cli to pick up the watcher, we need to pass the instance from gulpfile.js
const fn = (config, gulp, options) => {
  if (!(options && options.task && options.task.config && options.task.config.watch)) {
    return new Error('No watch path specified')
  }

  // Create named callback function for gulp-cli to be able to log it
  let cb = {
    [options.name] () {
      // Run task function with queued events as parameter
      const task = options.task.fn(events)

      // Reset events
      events = []

      return task
    }
  }

  const watcher = gulp.watch(options.task.config.watch, config, cb[options.name])

  let events = []

  watcher.on('all', function (event, path) {
    events.push({
      event,
      path
    })

    // Close after first run if `once` is true
    // Useful when starting a task having its own file watcher (i.e. webpack)
    if (config.once) {
      watcher.close()
    }
  })

  return watcher
}

module.exports = (options, gulp) => {
  const merge = require('lodash.merge')

  const config = merge({}, defaults, options)

  return {
    defaults,
    config,
    fn: fn.bind(null, config, gulp)
  }
}
