import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import LinkButton from './LinkButton';
import LinkModal from './LinkModal';
import { Check, Trash } from 'tabler-icons-react';
import { ThemeIcon } from '@mantine/core';


const Category = ({
  category,
  stateLinks,
  setLinks,
  setCategories,
  categories,
  handleDeleteCategory,
  handleDeleteLink,
}) => {
  const [linksData, setLinksData] = useState([]);
  console.log(linksData, 'linksData');
  useEffect(() => {
    console.log(category.links, 'categoryLinks', stateLinks, 'stateLinks2');
    if (
      Array.isArray(stateLinks) &&
      stateLinks.length &&
      category.links &&
      category.links.length
    ) {
      console.log('check');
      let matchingLinks = category.links.map(id => {
        let idk = stateLinks.map(savedLink => {
          if (savedLink.id === id) {
            console.log(savedLink.blockedLinks, 'blockedLinks');
            return savedLink.blockedLinks;
          }
        });
        console.log(idk, 'idk2');
        idk = idk.filter(function (element) {
          return element !== undefined;
        });
        return idk[0];
      });
      console.log('matchingLinks1', matchingLinks)
      matchingLinks = matchingLinks.filter(function (element) {
        return element !== undefined;
      });
      matchingLinks = [].concat.apply([], matchingLinks);
      console.log(matchingLinks, 'matchingLinks2');
      setLinksData(matchingLinks);
    } else {
      setLinksData([]);
    }
  }, [stateLinks]);

  useEffect(() => {
    console.log('matchingLinksState', linksData);
  }, [linksData]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);

  const [activeModal, setActiveModal] = useState('');

  const [categoryTitle, setCategoryTitle] = useState(category.title);

  function handleOpenLinkModal(val) {
    setActiveModal(val);
    setShowLinkModal(true);
  }

  function handleCloseLinkModal(val) {
    setShowLinkModal(false);
  }

  function editCategoryTitle(e) {
    e.preventDefault();
    console.log('hm');
    const updatedCategories = categories.map(selectedCategory => {
      if (selectedCategory.title === category.title) {
        let temp = selectedCategory;
        temp.title = categoryTitle;
        return temp;
      } else {
        return selectedCategory;
      }
    });
    setCategories(updatedCategories);
  }

  return (
    <div className="note">
      <div className="note-header">
        <form onSubmit={editCategoryTitle}>
          <input
            className="title"
            value={categoryTitle}
            onChange={e => setCategoryTitle(e.target.value)}
          />
          <Check
            size={28}
            strokeWidth={3}
            color={'#4f862d'}
            onClick={editCategoryTitle}
          />
        </form>
        <ThemeIcon
          variant="light"
          size="xl"
          color="dark"
          onClick={() => handleDeleteCategory(category.title)}
        >
          <Trash size={25} strokeWidth={2} color={'black'} />
        </ThemeIcon>
      </div>
      <div className="links">
        {linksData && linksData.length ? (
          (console.log(linksData, 'linksData2'),
          linksData.map((link, i) => {
            console.log(link, 'wtfWHYYYYYYYY');
            return (
              <div onClick={() => handleOpenLinkModal(link)}>
              <LinkButton
                link={link}
                links={stateLinks}
                setLinks={setLinks}
                categories={categories}
                setCategories={setCategories}
                isLinkModalOpen={showLinkModal && activeModal === link}
                setIsLinkModalOpen={setShowLinkModal}
                handleOpenLinkModal={handleOpenLinkModal}
                handleDeleteLink={handleDeleteLink}
                setLinksData={setLinksData}
                key={i}
              />
              </div>
            );
          }))
        ) : (
          <p>No Links</p>
        )}
      </div>
      <button onClick={() => setIsModalOpen(true)}>Add Link</button>
      {isModalOpen && (
        <LinkModal
          category={category}
          categories={categories}
          setCategories={setCategories}
          links={stateLinks}
          setLinks={setLinks}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Category;
