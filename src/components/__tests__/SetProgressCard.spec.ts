import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'

import SetProgressCard from '../SetProgressCard.vue'

describe('SetProgressCard', () => {
  const factory = (props: { totalSets: number; currentSet: number }) =>
    mount(SetProgressCard, { props })

  it('marks the active set and labels the others', () => {
    const wrapper = factory({ totalSets: 4, currentSet: 2 })

    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Set 1')
    expect(wrapper.text()).not.toContain('Set 2')
  })

  it('shows a check mark for completed sets', () => {
    const wrapper = factory({ totalSets: 4, currentSet: 3 })

    expect(wrapper.findAll('.fa-check')).toHaveLength(2)
  })

  it('emits addSet from the add button and resetSets from the reset button', async () => {
    const wrapper = factory({ totalSets: 4, currentSet: 1 })
    const [addButton, resetButton] = wrapper.findAll('button')

    expect(addButton?.find('.fa-plus').exists()).toBe(true)

    await addButton?.trigger('click')
    expect(wrapper.emitted('addSet')).toHaveLength(1)

    await resetButton?.trigger('click')
    expect(wrapper.emitted('resetSets')).toHaveLength(1)
  })

  it('emits selectSet with the clicked set number', async () => {
    const wrapper = factory({ totalSets: 4, currentSet: 1 })

    await wrapper.findAll('div.cursor-pointer')[2]?.trigger('click')

    expect(wrapper.emitted('selectSet')).toEqual([[3]])
  })
})
