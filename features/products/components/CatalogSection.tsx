import { CatalogContent } from './CatalogContent';
import { getProductsByCategory } from '../product.service';

export async function CatalogSection() {
    const cakes = await getProductsByCategory('cakes');
    const cinnabons = await getProductsByCategory('cinnabons');

    return <CatalogContent productsByCategory={{ cakes, cinnabons }} />;
}
