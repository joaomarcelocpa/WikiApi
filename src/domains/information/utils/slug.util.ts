export class SlugUtil {
  static generate(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static generateFull(
    categoryName: string,
    subCategoryName: string,
    question: string,
  ): string {
    const categorySlug = this.generate(categoryName);
    const subCategorySlug = this.generate(subCategoryName);
    const questionSlug = this.generate(question);

    return `${categorySlug}/${subCategorySlug}/${questionSlug}`;
  }

  static generateUnique(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
      const parts = baseSlug.split('/');
      const lastPart = parts[parts.length - 1];
      parts[parts.length - 1] = `${lastPart}-${counter}`;
      slug = parts.join('/');
      counter++;
    }

    return slug;
  }
}
