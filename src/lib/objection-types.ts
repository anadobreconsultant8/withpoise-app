export type ObjectionCategory = {
  id: string
  label: string
  objections: { id: string; label: string }[]
}

export const OBJECTION_CATEGORIES: ObjectionCategory[] = [
  {
    id: 'price_budget',
    label: 'Price & Budget',
    objections: [
      { id: 'too_expensive', label: "It's too expensive" },
      { id: 'budget_frozen', label: 'Our budget is frozen' },
      { id: 'cheaper_competitor', label: 'We found someone cheaper' },
      { id: 'discount_request', label: 'Can you give us a discount?' },
      { id: 'roi_unclear', label: "We're not sure about the ROI" },
    ],
  },
  {
    id: 'timing_priority',
    label: 'Timing & Priority',
    objections: [
      { id: 'not_now', label: 'Not the right time' },
      { id: 'too_busy', label: "We're too busy right now" },
      { id: 'next_quarter', label: "Let's revisit next quarter" },
      { id: 'other_priorities', label: 'We have other priorities' },
    ],
  },
  {
    id: 'trust_risk',
    label: 'Trust & Risk',
    objections: [
      { id: 'need_references', label: 'We need to see references' },
      { id: 'too_new', label: "You're too new / not established" },
      { id: 'bad_experience', label: "We've had bad experiences before" },
      { id: 'want_guarantee', label: 'Can you guarantee results?' },
    ],
  },
  {
    id: 'scope_creep',
    label: 'Scope Creep',
    objections: [
      { id: 'can_you_add', label: 'Can you add this too?' },
      { id: 'change_scope', label: 'We want to change the scope' },
      { id: 'free_extras', label: 'Can you throw this in for free?' },
    ],
  },
  {
    id: 'payment_terms',
    label: 'Payment Terms',
    objections: [
      { id: 'pay_later', label: 'Can we pay after delivery?' },
      { id: 'milestone_based', label: 'We want milestone-based payment' },
      { id: 'reduce_upfront', label: 'Can you reduce the upfront cost?' },
    ],
  },
]

export const TONES = [
  {
    id: 'diplomatic',
    label: 'Diplomatic',
    description: 'Warm, relationship-first',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Professional & clear',
  },
  {
    id: 'assertive',
    label: 'Assertive',
    description: 'Direct & confident',
  },
  {
    id: 'very_firm',
    label: 'Very Firm',
    description: 'Hard boundaries',
  },
]

export const RELATIONSHIP_LEVELS = [
  { id: 'new', label: 'New prospect' },
  { id: 'warm', label: 'Warm lead' },
  { id: 'existing', label: 'Existing client' },
]

export const OBJECTIVES = [
  { id: 'close', label: 'Close the deal' },
  { id: 'retain', label: 'Retain the client' },
  { id: 'graceful_exit', label: 'Graceful exit' },
]
