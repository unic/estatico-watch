const name = 'watch'

const defaults = {
  task: {
    name: null,
    fn: null,
    config: {},
  },
  once: false,
  watcher: {
    usePolling: false
  }
}

const fn = (options) => {
  const merge = require('lodash.merge')
  const watch = require('glob-watcher')
  const log = require('fancy-log')
  const chalk = require('chalk')
  const prettyTime = require('pretty-hrtime')

  const config = merge({}, defaults, options)
  const watcher = watch(config.task.config.watch, config.watcher)

  watcher.on('all', function(event, path) {
    var taskConfig = merge({}, config.task.config, {
      watcher: {
        event,
        path
      }
    }),
      start = process.hrtime(),
      end,
      time

    // Log duration analogously to how gulp.start would do it
    log('Starting', '\'' + chalk.cyan(config.task.name) + '\'...')

    // Explicitly run task function and provide changed file as parameter
    config.task.fn(taskConfig, function() {
      end = process.hrtime(start)
      time = prettyTime(end)

      log('Finished', '\'' + chalk.cyan(config.task.name) + '\'', 'after', chalk.magenta(time))
    })

    // Close after first run if `once` is true
    // Useful when starting a task having its own file watcher (i.e. webpack)
    if (config.once) {
      watcher.close()
    }
  });

  return watcher
}

// fn({
//   task: {
//     config: {
//       watch: '.'
//     },
//     fn: function(config, cb) {
//       console.log(config.watcher);
//       cb();
//     },
//     name: 'yay'
//   }
// })

module.exports = {
  name,
  fn,
  defaults
}
