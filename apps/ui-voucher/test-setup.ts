import axios from "axios";
import { initLocalization } from '@butlerhospitality/ui-sdk';
import { resources } from './locales';
initLocalization(resources);
import MockAdapter from "axios-mock-adapter";

let mock: MockAdapter;
mock = new MockAdapter(axios);
global.mock = mock;
jest.mock('axios', () => {
  return {
    ...jest.requireActual('axios'),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
});