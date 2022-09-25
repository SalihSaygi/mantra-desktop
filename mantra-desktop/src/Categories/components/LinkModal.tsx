import React, { useEffect, useRef, useState } from 'react';
import './modal.css';
import useOnClickOutside from './useOnClickOutside';
import { Checkbox, CheckboxGroup } from '@mantine/core';
import { nanoid } from 'nanoid';

const LinkModal = ({
  category,
  categories,
  setCategories,
  links,
  setLinks,
  isModalOpen,
  setIsModalOpen,
}) => {
  const showHideClassName = isModalOpen
    ? 'modal display-block'
    : 'modal display-none';

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => setIsModalOpen(false));

  const [blockedLink, setBlockedLink] = useState(['']);
  const [exceptionLinks, setExceptionLinks] = useState(['']);
  const [categoryButtons, setCategoryButtons] = useState([category.title]);

  function handleOnChangeLinks(i, event) {
    const values = [...blockedLink];
    values[i] = event.target.value;
    setBlockedLink(values);
  }

  function handleOnChangeExceptionLinks(i, event) {
    const values = [...exceptionLinks];
    values[i] = event.target.value;
    setExceptionLinks(values);
  }

  function handleAddLink() {
    const values = [...blockedLink];
    values.push('');
    setBlockedLink(values);
  }

  function handleAddExceptionLink() {
    const values = [...exceptionLinks];
    values.push('');
    setExceptionLinks(values);
  }

  function handleRemoveLink(i) {
    const values = [...blockedLink];
    values.splice(i, 1);
    setBlockedLink(values);
  }

  function handleRemoveExceptionLink(i) {
    const values = [...exceptionLinks];
    values.splice(i, 1);
    setExceptionLinks(values);
  }

  function handleDelete(e) {}

  function handleSubmit(e) {
    const id = nanoid();
    e.preventDefault();
    if (categoryButtons) {
      const newLink = {
        id: id,
        blockedLinks: blockedLink,
        exceptionLinks: exceptionLinks,
        categories: categoryButtons,
      };
      console.log('newLink', newLink);
      if (links && links.length) {
        console.log('links', links);

        setLinks([...links, newLink]);
      } else {
        console.log('no link');
        setLinks([newLink]);
      }

      const updatedCategories = categories.map(categoryData => {
        console.log('alo1', categoryData);
        const idk = categoryButtons.map(title => {
          //
          if (categoryData.title === title) {
            let linkIDs = categoryData.links;
            console.log(linkIDs, 'linkIDs');
            const newLinks = [...linkIDs, id];
            console.log(newLinks, 'newLinks');
            const newCategory = {
              title: categoryData.title,
              links: newLinks, //will use this id to lookup the link in local storage
            };
            console.log(newCategory, 'newCategory');
            return newCategory;
          } else if (categoryData.title !== title) {
            return categoryData;
          }
        });
        console.log('idk', idk);
        return idk[0];
      });
      console.log(updatedCategories, 'updatedCategories');
      setBlockedLink(['', '']);
      setExceptionLinks(['', '']);
      setCategories(updatedCategories);
      setIsModalOpen(false);
    }
  }

  return (
    <div className={showHideClassName}>
      <form onSubmit={handleSubmit} className="modal-main" ref={modalRef}>
        <div className="flex-1">
          <p className="modal-titles">Blocked Link</p>
          {/* {Object.keys(blockedLink).map(c => {
            return <p>{blockedLink[c]}</p>;
          })} */}
          {/* to see whether the dynamic form works */}
          {blockedLink &&
            blockedLink.map((c, index) => {
              console.log('C1', index);
              return (
                <div>
                  <input
                    onChange={e => handleOnChangeLinks(index, e)}
                    key={index}
                    className="input-links"
                    data-link={index}
                    type="text"
                  ></input>
                  {/* <button
                  className="margin-buttons"
                  onClick={() => handleRemoveLink(index)}
                >
                  Remove Link
                </button> */}
                </div>
              );
            })}
          <button className="margin-buttons" onClick={handleAddLink}>
            New Link
          </button>
          {/* //to add more input fields */}
        </div>
        <div className="flex-1">
          <p className="modal-titles">Exception</p>
          {/* {Object.keys(exceptionLinks).map(c => {
            return <p>{exceptionLinks[c]}</p>;
          })} */}
          {/* to see whether the dynamic form works */}
          {exceptionLinks &&
            exceptionLinks.map((c, index) => {
              console.log('C1', index);

              return (
                <div>
                  <input
                    onChange={e => handleOnChangeExceptionLinks(index, e)}
                    key={index}
                    className="input-links"
                    data-link={index}
                    type="text"
                  ></input>
                  {/* <button
                  className="margin-buttons"
                  onClick={() => handleRemoveExceptionLink(index)}
                >
                  Remove Link
                </button> */}
                </div>
              );
            })}
          <button className="margin-buttons" onClick={handleAddExceptionLink}>
            New Link
          </button>
          {/* //to add more input fields */}
        </div>
        <div className="flex-1">
          <p className="modal-titles">Categories</p>
          {categories.length ? (
            <div>
              <CheckboxGroup
                value={categoryButtons}
                onChange={setCategoryButtons}
                label="Select which categories of notes this link should lead."
                required
              >
                {categories.map((categoryData, index) => {
                  return (
                    <Checkbox
                      key={index}
                      value={categoryData.title}
                      label={categoryData.title}
                    />
                  );
                })}
              </CheckboxGroup>
            </div>
          ) : (
            <p>Wait</p>
          )}
          <button className="margin-buttons" id="submit-button" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LinkModal;
