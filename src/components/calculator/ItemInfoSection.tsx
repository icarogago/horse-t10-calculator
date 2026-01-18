import { Info } from 'lucide-react';
import { ITEMS } from '../../data/items';

const INFO_ITEMS = [
  'flor-errante',
  'raiz-samambaia',
  'cristal-pedra-luz',
  'melodia-estrelas'
];

export function ItemInfoSection() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {INFO_ITEMS.map((itemId) => {
        const item = ITEMS[itemId];
        if (!item) return null;

        return (
          <div 
            key={itemId}
            className="bg-white dark:bg-t10-dark-surface p-4 rounded-lg border border-t10-blue-4/20 dark:border-t10-dark-surfaceBorder shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="bg-t10-blue-1/10 dark:bg-indigo-500/10 p-2 rounded-full mt-1">
                <Info size={16} className="text-t10-blue-1 dark:text-t10-dark-textHighlight" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-t10-blue-1 dark:text-t10-dark-textPrimary mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-t10-blue-3 dark:text-t10-dark-textSecondary leading-relaxed">
                  {item.acquisitionNote || 'Informação de aquisição não disponível.'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
