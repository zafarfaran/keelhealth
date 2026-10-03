'use client';

import { useState } from 'react';
import Em from './Em';

type Cur = 'gbp' | 'usd';

const PRICES = {
  weekly: { gbp: '£4.99', usd: '$5.99' },
  weeklyCmp: { gbp: '£4.99 a week', usd: '$5.99 a week' },
  annual: { gbp: '£79.99', usd: '$89.99' },
  annualCmp: {
    gbp: '£1.54 a week, billed annually',
    usd: '$1.73 a week, billed annually',
  },
  monthlyCmp: {
    gbp: '£14.99 a month · £3.46 a week',
    usd: '$17.99 a month · $4.15 a week',
  },
  lifetime: { gbp: '£199', usd: '$229' },
};

export default function Pricing() {
  const [cur, setCur] = useState<Cur>('gbp');
  const [plan, setPlan] = useState<'weekly' | 'annual'>('annual');

  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Pricing</p>
          <h2 className="h2">
            Every plan is the <Em>whole app</Em>
          </h2>
          <p className="lede">
            Same features on every subscription. Pick how you&apos;d like to pay. All
            subscriptions start with a 7-day free trial that includes everything.
          </p>
          <div className="currency" role="group" aria-label="Currency">
            <button
              className={cur === 'gbp' ? 'cur is-on' : 'cur'}
              aria-pressed={cur === 'gbp'}
              onClick={() => setCur('gbp')}
            >
              £ UK
            </button>
            <button
              className={cur === 'usd' ? 'cur is-on' : 'cur'}
              aria-pressed={cur === 'usd'}
              onClick={() => setCur('usd')}
            >
              $ US
            </button>
          </div>
        </div>

        <div className="plans">
          <label className="plan" htmlFor="plan-weekly">
            <input
              type="radio"
              name="plan"
              id="plan-weekly"
              value="weekly"
              checked={plan === 'weekly'}
              onChange={() => setPlan('weekly')}
            />
            <span className="plan-name">Weekly</span>
            <span className="plan-price">
              <span className="big">{PRICES.weekly[cur]}</span>
              <span className="per"> a week</span>
            </span>
            <span className="plan-cmp">{PRICES.weeklyCmp[cur]}</span>
            <span className="plan-terms">
              Billed every 7 days after the trial. Renews automatically until you cancel.
            </span>
            <span className="btn btn-secondary plan-btn">Start 7-day free trial</span>
          </label>

          <label className="plan is-rec" htmlFor="plan-annual">
            <input
              type="radio"
              name="plan"
              id="plan-annual"
              value="annual"
              checked={plan === 'annual'}
              onChange={() => setPlan('annual')}
            />
            <span className="badge">Save 69%</span>
            <span className="plan-name">Annual</span>
            <span className="plan-price">
              <span className="big">{PRICES.annual[cur]}</span>
              <span className="per"> a year</span>
            </span>
            <span className="plan-cmp">{PRICES.annualCmp[cur]}</span>
            <span className="plan-terms">
              Billed every 12 months after the trial. Renews automatically until you cancel.
            </span>
            <span className="btn btn-primary plan-btn">Start 7-day free trial</span>
          </label>
        </div>

        <div className="plan-row">
          <div>
            <span className="plan-name">Monthly</span>
            <span className="plan-cmp">{PRICES.monthlyCmp[cur]}</span>
          </div>
          <span className="plan-terms">
            Billed every month after the 7-day trial. Renews automatically until you cancel.
          </span>
          <a className="btn btn-secondary btn-sm" href="#">
            Start 7-day free trial
          </a>
        </div>

        <p className="terms">
          Every subscription renews automatically at the price shown until you cancel.
          Cancel any time in the app in two taps, or from your App Store or Google Play
          subscriptions. If you cancel during the trial you won&apos;t be charged. Restore
          purchases from the app at any time.
        </p>

        <div className="lifetime">
          <div>
            <span className="plan-name">Lifetime</span>
            <p className="body-2">
              One payment, <b>{PRICES.lifetime[cur]}</b>, and the app is yours for good.
              Launch offer, limited to the first 400 people. No trial on this one, since
              there&apos;s nothing to renew.
            </p>
          </div>
          <a className="btn btn-secondary btn-sm" href="#">
            Buy lifetime
          </a>
        </div>
      </div>
    </section>
  );
}
