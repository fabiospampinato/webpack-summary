
/* TYPES */

type Options = {
  normal: {
    entry: string | boolean,
    chunk: string | boolean
  },
  watching: {
    entry: string | boolean
    chunk: string | boolean
  }
};

/* EXPORT */

export {Options};
