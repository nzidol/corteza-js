import { EventBus } from './eventbus'
import { expect } from 'chai'
import { Dummy } from '../events/dummy'
import { onManual } from './shared'

describe(__filename, () => {
  describe('dispatching', () => {
    let eb: EventBus

    beforeEach(() => {
      eb = new EventBus()
    })

    it('should not raise any errors when dispatching w/o any registered handlers', () => {
      eb.WaitFor(new Dummy({ resource: 'res1', event: 'ev1' }))
    })

    it('should trigger registered handler', async () => {
      let guineapig = 0
      const t = { eventTypes: ['e1'], resourceTypes: ['r1'] }
      const h = async (): Promise<undefined> => {
        guineapig = 42
        return undefined
      }

      expect(guineapig).to.equal(0)
      eb.Register(h, t)
      await eb.WaitFor(new Dummy({ resource: 'r1', event: 'e1' }))
      expect(guineapig).to.equal(42)
    })

    it('should exec registered handler (on Manual)', async () => {
      let guineapig = 0
      const t = { eventTypes: [onManual], resourceTypes: ['r1'], scriptName: 'sn1' }
      const h = async (): Promise<undefined> => {
        guineapig = 42
        return undefined
      }

      expect(guineapig).to.equal(0)
      eb.Register(h, t)
      await eb.WaitFor(new Dummy({ resource: 'r1', event: onManual }), 'sn1')
      expect(guineapig).to.equal(42)
    })

    it('should not exec registered handler (on Manual) on non-matching script', async () => {
      let guineapig = 0
      const t = { eventTypes: [onManual], resourceTypes: ['r1'], scriptName: 'sn-foo' }
      const h = async (): Promise<undefined> => {
        guineapig = 42
        return undefined
      }

      expect(guineapig).to.equal(0)
      eb.Register(h, t)
      await eb.WaitFor(new Dummy({ resource: 'r1', event: onManual }), 'sn1')
      expect(guineapig).to.equal(0)
    })
  })
})
