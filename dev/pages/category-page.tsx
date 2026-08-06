import { EntityList, Heading, ListRow } from '../../src';
import { componentPath, type CategoryEntry } from '../registry';

export const CategoryPage = ({ category }: { category: CategoryEntry }) => (
  <div className="space-y-6">
    <Heading as="h1" description={category.description}>
      {category.label}
    </Heading>
    <EntityList>
      {category.components.map((component) => (
        <ListRow
          key={component.slug}
          href={componentPath(category.slug, component.slug)}
          title={component.name}
          description={component.description}
          meta={`${String(component.exports.length)} export${component.exports.length === 1 ? '' : 's'}`}
        />
      ))}
    </EntityList>
  </div>
);
