import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';

export default function MonetizationOptions({ projectId }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { currentProject, updateProject } = useProject();

  const monetizationOptions = [
    {
      id: 'premium',
      title: 'Premium Course',
      description: 'Make this course premium and charge for access',
      icon: '⭐',
      price: 29.99,
      features: ['Full course access', 'Downloadable resources', 'Certificate of completion']
    },
    {
      id: 'subscription',
      title: 'Subscription Access',
      description: 'Offer monthly subscription access to your course',
      icon: '🔄',
      price: 9.99,
      features: ['Monthly access', 'Regular updates', 'Community access']
    },
    {
      id: 'sponsorship',
      title: 'Sponsored Content',
      description: 'Allow sponsors to promote their content in your course',
      icon: '💼',
      price: 49.99,
      features: ['Sponsor banner placement', 'Product mentions', 'Dedicated sponsor section']
    },
    {
      id: 'affiliate',
      title: 'Affiliate Marketing',
      description: 'Earn commissions by promoting related products',
      icon: '🤝',
      price: '15% commission',
      features: ['Product recommendations', 'Affiliate links', 'Performance tracking']
    }
  ];

  const handleSelectOption = async (optionId) => {
    try {
      await updateProject(projectId, {
        monetization: {
          type: optionId,
          enabled: true,
          price: monetizationOptions.find(opt => opt.id === optionId).price
        }
      });
      setSelectedOption(optionId);
    } catch (error) {
      console.error('Error updating monetization:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Monetization Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monetizationOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedOption === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => handleSelectOption(option.id)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                <div className="text-sm">
                  <p className="font-medium text-primary-600">
                    {typeof option.price === 'number' 
                      ? `$${option.price.toFixed(2)}` 
                      : option.price}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 