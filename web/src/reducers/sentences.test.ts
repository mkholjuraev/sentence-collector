import * as sentences from '../actions/sentences';
import sentencesReducer from './sentences';

const combineState = (fields: Record<string, unknown>) => {
  const initialState = sentencesReducer(undefined, {
    type: 'inexistant',
  });
  
  return {
    ...initialState,
    ...fields,
  };
};

test('should use initial state', async () => {
  const newState = sentencesReducer(combineState({}), {
    type: 'inexistant',
  });

  expect(newState).toEqual({
    sentenceSubmissionFailures: {},
    isUploadingSentences: false,
    rejectedSentencesLoading: false,
    rejectedSentences: {},
    rejectedSentencesError: '',
    sentences: [],
    sentencesLoading: false,
    reviewMessage: '',
  });
});

test('should reduce submit request', async () => {
  const newState = sentencesReducer(combineState({ sentenceSubmissionFailures: ['oh no'] }), {
    type: sentences.ACTION_SUBMIT_SENTENCES_REQUEST,
  });

  expect(newState.sentenceSubmissionFailures).toEqual({});
  expect(newState.isUploadingSentences).toEqual(true);
});

test('should reduce submission failure', async () => {
  const submissionFailures = [{
    error: 'Too long',
    sentence: 'Super super long sentence',
  }, {
    error: 'Too long',
    sentence: 'Another super long sentence',
  }, {
    error: 'Has symbols',
    sentence: '$$$$$',
  }];
  const newState = sentencesReducer(combineState({}), {
    type: sentences.ACTION_SUBMIT_SENTENCES_ERRORS,
    errors: submissionFailures,
  });

  expect(newState.sentenceSubmissionFailures).toEqual({
    'Too long': [
      'Super super long sentence',
      'Another super long sentence',
    ],
    'Has symbols': ['$$$$$'],
  });
});

test('should reduce submit done', async () => {
  const newState = sentencesReducer(combineState({ isUploadingSentences: true }), {
    type: sentences.ACTION_SUBMIT_SENTENCES_DONE,
  });

  expect(newState.isUploadingSentences).toEqual(false);
});

test('should reduce rejected sentences request', async () => {
  const newState = sentencesReducer(combineState({ rejectedSentencesError: 'oh no' }), {
    type: sentences.ACTION_LOAD_REJECTED_SENTENCES,
  });

  expect(newState.rejectedSentencesLoading).toEqual(true);
  expect(newState.rejectedSentencesError).toEqual(null);
});

test('should reduce rejected sentences', async () => {
  const testSentences = ['Hi', 'All good?'];
  const newState = sentencesReducer(combineState({}), {
    type: sentences.ACTION_GOT_REJECTED_SENTENCES,
    sentences: testSentences,
  });

  expect(newState.rejectedSentencesLoading).toEqual(false);
  expect(newState.rejectedSentences).toEqual(testSentences);
});

test('should reduce rejected sentences failure', async () => {
  const errorMessage = 'oh no';
  const newState = sentencesReducer(combineState({ rejectedSentencesLoading: true }), {
    type: sentences.ACTION_REJECTED_SENTENCES_FAILURE,
    errorMessage,
  });

  expect(newState.rejectedSentencesLoading).toEqual(false);
  expect(newState.rejectedSentences).toEqual({});
  expect(newState.rejectedSentencesError).toEqual(errorMessage);
});

test('should reduce loading sentences', async () => {
  const newState = sentencesReducer(combineState({}), {
    type: sentences.ACTION_LOAD_SENTENCES,
  });

  expect(newState.sentencesLoading).toEqual(true);
});

test('should reduce sentences', async () => {
  const testSentences = ['Hi', 'All good?'];
  const newState = sentencesReducer(combineState({ sentencesLoading: true }), {
    type: sentences.ACTION_GOT_SENTENCES,
    sentences: testSentences,
  });

  expect(newState.sentencesLoading).toEqual(false);
  expect(newState.sentences).toEqual(testSentences);
});

test('should reduce reviewed sentences', async () => {
  const newState = sentencesReducer(combineState({}), {
    type: sentences.ACTION_REVIEWED_SENTENCES,
    votes: 10,
  });

  expect(newState.reviewMessage).toEqual('10 sentences reviewed. Thank you!');
});

test('should reduce reviewed sentences failure', async () => {
  const errorMessage = 'oh no';
  const newState = sentencesReducer(combineState({}), {
    type: sentences.ACTION_REVIEW_SENTENCES_FAILURE,
    errorMessage,
  });

  expect(newState.reviewMessage).toEqual(errorMessage);
});

test('should reduce review message reset', async () => {
  const newState = sentencesReducer(combineState({ reviewMessage: 'hi' }), {
    type: sentences.ACTION_REVIEW_RESET_MESSAGE,
  });

  expect(newState.reviewMessage).toEqual('');
});
