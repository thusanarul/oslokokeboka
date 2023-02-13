export const loader = () => {
  const text = `
        User-agent: Googlebot
        Disallow: /_admin/
        

        User-agent: *
        Disallow: /_admin/

        Sitemap: https://oslokokeboka.no/sitemap.xml
        `;

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
