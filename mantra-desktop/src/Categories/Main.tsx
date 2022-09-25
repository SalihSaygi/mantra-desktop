import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addRedirectRule } from '../utils/rules';
import { blockedURL, Category as CategoryI } from '../utils/storage';
// import NotesList from '../Notes/components/NotesList';
// import useQuery from '../useQuery';
// import Category from './components/Category';
import CategoryList from './components/CategoryList';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Header from './components/Header';
import { Category } from '../utils/storage';
import * as localForage from "localforage";
import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
import { writeTextFile } from '@tauri-apps/api/fs';

const Categories = () => {
  console.log("aloo3")
  // const query = useQuery();
  // const queryParams = query.get('categories');
  // let queryCategories;
  // if (queryParams) {
  //   queryCategories = queryParams.split('-');
  // }
  // const savedCategories = JSON.parse(
  //   localStorage.getItem('mantra-app-category')
  // );

  // let matchedCategories;
  // if (queryCategories && queryCategories.length > 1) {
  //   console.log('more than one category in query');

  //   matchedCategories = queryCategories.filter(
  //     q => !savedCategories.some(category => category.name === q)
  //   );
  // } else if (queryCategories && queryCategories.length === 1) {
  //   console.log('only one category in query');
  //   matchedCategories = savedCategories.some(el => {
  //     if (el.name === queryCategories) return el.name;
  //   });
  // } else {
  //   console.log('no category in query');
  //   matchedCategories = savedCategories;
  // }

  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<blockedURL[]>([]);

  const [darkMode, setDarkMode] = useState(false);

  //this is for initializing the categories from localStorage
  useEffect(() => {
    let savedCategories: CategoryI[]
      localForage.getItem("categories", function(err, storedCategories: any) {
      savedCategories = storedCategories
      console.log(savedCategories, 'savedCategories');
      if (Array.isArray(savedCategories)) {
        console.log('check', savedCategories);
        setCategories(savedCategories);
      }
    })

  }, []);

  //this is for initializing the blockedURLs from localStorage
  useEffect(() => {
    let savedLinks: blockedURL[]
      localForage.getItem("blockedURLs", function(err, storedURL: any) {
        savedLinks = storedURL
        console.log(savedLinks, 'savedLinks');
        if (Array.isArray(savedLinks)) {
          console.log('check');
          setLinks(savedLinks);
        }
    })
  }, []);

  //this is to control input element
  const [categoryField, setCategoryField] = useState('');

  //this is the property of the category
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    if (categoryField) {
      setCategoryTitle(categoryField);
    }
  }, [categoryField]);

  function createNewCategory(e: any) {
    e.preventDefault();
    const newCategory = {
      title: categoryTitle,
      links: [],
    };
    console.log(newCategory, 'newCategory');
    setCategoryField('');
    setCategories(prevCategories => [...prevCategories, newCategory]);
  }

  //when the category state changes, store it to localStorage
  useEffect(() => {
    localForage.setItem('categories', categories).then(() => {
      console.log('localForageCategories', categories)
    })  
  }, [categories]);

  //this is for updating the rules.json file to block urls
  useEffect(() => {
    //this hugely needs error checks
    console.log('addRedirectionRule', links)
    links.forEach(url => url.blockedLinks.forEach(blockedLink => {
      console.log(blockedLink, "blockedLink-addRedirectionRule")
      localForage.setItem('blockedURLs', links).then(() => {
        console.log('linksStored', links)
          addRedirectRule(url, categories).then(() => {
            console.log('addRedirectRule Done')
          })
        // addRedirectRule(blockedLink, categories)
        //   .then(() => {
        //     if(url.exceptionLinks) {
        //       url.exceptionLinks.forEach(link => {
        //         console.log('link-addRedirectionRule', link)
        //         addExceptionRule(link)
        //       })
        //     }
        //     console.log('setStoredURL-addRedirectionRule', links)
        //   })
        //   .catch((e) => {
        //     console.log(e, "errAddRedirectRule")
        //   })
      })
  }))
  }, [links]);

  //this is for modals
  const [deleteConfirmModalCategory, setDeleteConfirmModalCategory] = useState({
    show: false,
    id: null,
  });

  function handleDeleteCategory(id: any) {
    setDeleteConfirmModalCategory({
      show: true,
      id,
    });
  }

  //it searches through categories using the id of the category 
  //and removes the matched category and then closes the modal
  function handleDeleteTrueCategory() {
    console.log('confirm');
    if (deleteConfirmModalCategory.show && deleteConfirmModalCategory.id) {
      let filteredData = categories.filter(
        category => category.title !== deleteConfirmModalCategory.id
      );
      console.log(filteredData, 'filteredData');
      setCategories(filteredData);
      setDeleteConfirmModalCategory({
        show: false,
        id: null,
      });
    }
  }

  const handleDeleteFalseCategory = () => {
    setDeleteConfirmModalCategory({
      show: false,
      id: null,
    });
  };

  const [deleteConfirmModalLink, setDeleteConfirmModalLink] = useState({
    show: false,
    id: null,
  });

  function handleDeleteLink(id: any) {
    setDeleteConfirmModalLink({
      show: true,
      id,
    });
  }

  //this function is only used for deleting links 
  //from categories's links property and then itself from localStorage
  function linkCategoryChaining() {
    let linkID: string = "";
    let filteredLinks = [];
    for (let i = 0; i < links.length; i++) {
      if (links[i].blockedLinks[0] !== deleteConfirmModalLink.id) {
        filteredLinks.push(links[i]);
      } else if (links[i].blockedLinks[0] === deleteConfirmModalLink.id) {
        linkID = links[i].id;
      }
    }
    let filteredCategories = [];
    for (let j = 0; j < categories.length; j++) {
      if (categories[j].links?.includes(linkID)) {
        let selectedCategory = categories[j];
        const newLinksOfCategory = selectedCategory.links?.filter(
          e => e !== linkID
        );
        selectedCategory.links = newLinksOfCategory;
        console.log(selectedCategory, 'newCategory');
        filteredCategories.push(selectedCategory);
      }
    }
    console.log(
      linkID,
      'linkID',
      deleteConfirmModalLink,
      'deleteConfirmModalCategory',
      links,
      'links',
      categories,
      'categories'
    );
    return { filteredLinks, filteredCategories };
  }

  function handleDeleteTrueLink() {
    let { filteredCategories, filteredLinks } = linkCategoryChaining();
    console.log(filteredCategories, filteredLinks);
    setCategories(filteredCategories);
    setDeleteConfirmModalLink({
      show: false,
      id: null,
    });
    setLinks(filteredLinks);
  }

  const handleDeleteFalseLink = () => {
    setDeleteConfirmModalLink({
      show: false,
      id: null,
    });
  };

  return (
    <div className={`${darkMode && 'dark-mode'}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} />
        <Link to="/notes">Notes</Link>

        {categories && categories.length ? (
          <CategoryList
            categories={categories}
            stateLinks={links}
            setLinks={setLinks}
            setCategories={setCategories}
            handleDeleteCategory={handleDeleteCategory}
            handleDeleteLink={handleDeleteLink}
          />
        ) : (
          <p>No Categories</p>
        )}
        <form onSubmit={createNewCategory}>
          <input
            type="text"
            placeholder="Strawberry"
            value={categoryField}
            onChange={e => setCategoryField(e.target.value)} //it was onInput, if this line causes troubles, go back to it
          />
          <button>New Category</button>
        </form>
      </div>
      {deleteConfirmModalCategory.show && (
        <DeleteConfirmModal
          handleDeleteTrue={handleDeleteTrueCategory}
          handleDeleteFalse={handleDeleteFalseCategory}
        />
      )}
      {deleteConfirmModalLink.show && (
        <DeleteConfirmModal
          handleDeleteTrue={handleDeleteTrueLink}
          handleDeleteFalse={handleDeleteFalseLink}
        />
      )}
    </div>
  );
};

export default Categories;
