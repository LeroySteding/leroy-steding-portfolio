interface Template {
  id: string;
  title: string;
  description: string;
}

export default function TemplatesGrid({
  templates,
}: {
  templates: Template[];
}) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Available Templates
        </h2>
        {templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="p-6 border rounded-lg">
                <h3 className="font-bold mb-2">{template.title}</h3>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Coming soon...</p>
        )}
      </div>
    </section>
  );
}
