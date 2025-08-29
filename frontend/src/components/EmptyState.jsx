import React from 'react';

const EmptyState = ({ 
  title = "No results found", 
  description = "Try adjusting your search criteria or filters to find what you're looking for.",
  icon: Icon,
  action
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {Icon && <Icon className="w-12 h-12 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
