import React from 'react';
import Category from './Category';

const CategoryList = ({
  categories,
  stateLinks,
  setLinks,
  setCategories,
  handleDeleteCategory,
  handleDeleteLink,
}) => {
  return (
    <div>
      {categories.map((category, index) => {
        return (
          <Category
            key={index}
            stateLinks={stateLinks}
            setLinks={setLinks}
            category={category}
            setCategories={setCategories}
            categories={categories}
            handleDeleteCategory={handleDeleteCategory}
            handleDeleteLink={handleDeleteLink}
          />
        );
      })}
    </div>
  );
};

export default CategoryList;
