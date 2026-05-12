

declare module "html2docx" {
  interface Html2DocxOptions {
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    title?: string;
    creator?: string;
    description?: string;
    keywords?: string[];
    subject?: string;
    revision?: string;
    creatorTool?: string;
    lastModifiedBy?: string;
    category?: string;
    contentStatus?: string;
    language?: string;
  }

  function html2docx(html: string, options?: Html2DocxOptions): Promise<Buffer>;
  
  export default html2docx;
  export { html2docx };
  export const html2docx: typeof html2docx;
}
