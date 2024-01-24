import MockAdapter from "axios-mock-adapter";

declare global {
    namespace NodeJS {
      interface Global {
        mock: MockAdapter;
      }
    }
  }
  