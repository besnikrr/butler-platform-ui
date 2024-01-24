const topics: { [key: string]: any[] } = {};
const subscribe = (topic: string, fn: any) => {
  if (!topics[topic]) {
    topics[topic] = [];
  }
  const id = Math.random();
  topics[topic][id] = fn;

  return () => {
    topics[topic][id] = null;
    delete topics[topic][id];
  };
};

const publish = (topic: string, args: number) => {
  if (!topics[topic]) return;
  Object.values(topics[topic]).forEach((fn: any) => {
    if (fn) {
      fn(args, topic);
    }
  });
};

const subscribeToMultipleTopics = (topicss: string[], fn: any) => {
  let unsubscribe = () => {};
  topicss.forEach((topic: string) => {
    unsubscribe = subscribe(topic, fn);
  });
  return unsubscribe;
};

export { subscribe, publish, subscribeToMultipleTopics };
