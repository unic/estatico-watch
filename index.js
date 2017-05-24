const name = 'watch'

const defaults = {
  task: {
    name: null,
    fn: null,
    config: {}
  },
  once: false,
  watcher: {
    usePolling: false
  }
}

// In order for gulp-cli to pick up the watcher, we need to pass the instance from gulpfile.js
const fn = (options, gulp) => {
  const merge = require('lodash.merge')

  const config = merge({}, defaults, options)

  if (!config.task.config.watch) {
    return new Error('No watch path specified')
  }

  // Create named callback function for gulp-cli to be able to log it
  let cb = {
    [config.task.name] () {
      // Run task function with queued events as parameter
      const task = config.task.fn(config.task.config, events)

      // Reset events
      events = []

      return task
    }
  }

  const watcher = gulp.watch(config.task.config.watch, config.watcher, cb[config.task.name])

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

module.exports = {
  name,
  fn,
  defaults
}
