const Validate = (rules: any) => {
  for (const r of rules) {
    if (r.condition) return r;
  }
  return null;
};

export default Validate;
