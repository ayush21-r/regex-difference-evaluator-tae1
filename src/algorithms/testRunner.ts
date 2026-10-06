// Standalone algorithm test suite

import { evaluateRegexDifference } from './evaluator';

interface TestCase {
  name: string;
  r1: string;
  r2: string;
  expectDifference: boolean;
  expectedSampleWitness?: string[];
}

const testCases: TestCase[] = [
  {
    name: 'Example 1: a(b|c)* vs ab*',
    r1: 'a(b|c)*',
    r2: 'ab*',
    expectDifference: true,
    expectedSampleWitness: ['ac'],
  },
  {
    name: 'Example 2: a|b vs a',
    r1: 'a|b',
    r2: 'a',
    expectDifference: true,
    expectedSampleWitness: ['b'],
  },
  {
    name: 'Example 3: ab* vs a',
    r1: 'ab*',
    r2: 'a',
    expectDifference: true,
    expectedSampleWitness: ['ab'],
  },
  {
    name: 'Example 4: Equivalent a* vs (a)*',
    r1: 'a*',
    r2: '(a)*',
    expectDifference: false,
  },
  {
    name: 'Example 5: Plus operator a+ vs a',
    r1: 'a+',
    r2: 'a',
    expectDifference: true,
    expectedSampleWitness: ['aa'],
  },
  {
    name: 'Example 6: Question operator a? vs a',
    r1: 'a?',
    r2: 'a',
    expectDifference: true,
    expectedSampleWitness: [''], // empty string ε
  },
  {
    name: 'Example 7: Disjoint languages a* vs b*',
    r1: 'a*',
    r2: 'b*',
    expectDifference: true,
    expectedSampleWitness: ['a'],
  },
  {
    name: 'Example 8: Subset language a vs a|b',
    r1: 'a',
    r2: 'a|b',
    expectDifference: false, // every string in L(a) is in L(a|b)
  },
  {
    name: 'Example 9: Epsilon handling ε vs a',
    r1: 'ε',
    r2: 'a',
    expectDifference: true,
    expectedSampleWitness: [''],
  },
];

console.log('--- RUNNING REGEX DIFFERENCE ALGORITHM TESTS ---');
let passed = 0;

for (const tc of testCases) {
  try {
    const result = evaluateRegexDifference(tc.r1, tc.r2);

    if (result.witnessResult.hasDifference !== tc.expectDifference) {
      console.error(`❌ FAILED: ${tc.name}`);
      console.error(`  Expected hasDifference=${tc.expectDifference}, got ${result.witnessResult.hasDifference}`);
      continue;
    }

    if (tc.expectDifference) {
      if (!result.verification.isWitnessValid) {
        console.error(`❌ FAILED (Verification): ${tc.name}`);
        console.error(`  Witness "${result.witnessResult.witness}" was not validated by both DFAs!`);
        continue;
      }
    }

    console.log(`✅ PASSED: ${tc.name} -> Witness: "${result.witnessResult.witnessDisplay}"`);
    passed++;
  } catch (err: any) {
    console.error(`❌ ERROR in ${tc.name}:`, err.message);
  }
}

console.log(`\nTEST RESULTS: ${passed}/${testCases.length} tests passed.`);
