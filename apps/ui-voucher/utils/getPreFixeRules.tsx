function getPreFixeRules(program: any): Array<string> {
  const rules: string[] = [];
  if (program.rules) {
    Object.values(program.rules).forEach((category: any) => {
      category.configs.forEach((sub: any) => {
        const subcategories = Object.values(sub.subcategories);
        const { quantity } = sub;
        rules.push(`${quantity} ${subcategories.join(" or ")}`);
      });
    });
  }
  return rules;
}

export default getPreFixeRules;
