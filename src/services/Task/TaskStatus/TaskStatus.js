import { map as _map,
         invert as _invert,
         fromPairs as _fromPairs } from 'lodash'
import messages from './Messages'

// These statuses are defined on the server
export const TASK_STATUS_CREATED = 0
export const TASK_STATUS_FIXED = 1
export const TASK_STATUS_FALSE_POSITIVE = 2
export const TASK_STATUS_SKIPPED = 3
export const TASK_STATUS_DELETED = 4
export const TASK_STATUS_ALREADY_FIXED = 5
export const TASK_STATUS_TOO_HARD = 6

export const TaskStatus = Object.freeze({
  created: TASK_STATUS_CREATED,
  fixed: TASK_STATUS_FIXED,
  falsePositive: TASK_STATUS_FALSE_POSITIVE,
  skipped: TASK_STATUS_SKIPPED,
  deleted: TASK_STATUS_DELETED,
  alreadyFixed: TASK_STATUS_ALREADY_FIXED,
  tooHard: TASK_STATUS_TOO_HARD,
})

export const keysByStatus = Object.freeze(_invert(TaskStatus))

/**
 * Returns a Set of status progressions that are allowed
 * for the given status. An empty Set is returned if no
 * progressions are allowed.
 *
 * @returns a Set of allowed status progressions
 */
export const allowedStatusProgressions = function(status) {
  switch(status) {
    case TaskStatus.created:
      return new Set([TaskStatus.fixed, TaskStatus.falsePositive,
                      TaskStatus.skipped, TaskStatus.deleted,
                      TaskStatus.alreadyFixed, TaskStatus.tooHard])
    case TaskStatus.fixed:
      return new Set()
    case TaskStatus.falsePositive:
      return new Set([TaskStatus.fixed])
    case TaskStatus.skipped:
    case TaskStatus.tooHard:
      return new Set([TaskStatus.fixed, TaskStatus.falsePositive,
                      TaskStatus.skipped, TaskStatus.alreadyFixed,
                      TaskStatus.tooHard])
    case TaskStatus.deleted:
      return new Set([TaskStatus.created])
    case TaskStatus.alreadyFixed:
      return new Set()
    default:
      throw new Error("unrecognized-task-status",
                      `Unrecognized task status ${status}`)
  }
}

/**
 * Returns an object mapping difficulty values to raw internationalized
 * messages suitable for use with FormattedMessage or formatMessage.
 */
export const messagesByStatus = _fromPairs(
  _map(messages, (message, key) => [TaskStatus[key], message])
)

/** Returns object containing localized labels  */
export const statusLabels = intl => _fromPairs(
  _map(messages, (message, key) => [key, intl.formatMessage(message)])
)
