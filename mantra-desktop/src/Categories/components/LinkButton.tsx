import { Checkbox, CheckboxGroup, ThemeIcon } from '@mantine/core';
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import useOnClickOutside from './useOnClickOutside';

const LinkButton = ({
  link,
  links,
  setLinks,
  categories,
  setCategories,
  isLinkModalOpen = false,
  setIsLinkModalOpen,
  handleOpenLinkModal,
  handleDeleteLink,
  setLinksData,
}) => {
  console.log('newRender', link);

  const showHideClassName = isLinkModalOpen
    ? 'modal display-block'
    : 'modal display-none';

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => setIsLinkModalOpen(false));

  const handleOpenLink = () => {
    //open modal to edit links settiyngs
    setIsLinkModalOpen(!isLinkModalOpen);
  };

  const [blockedLink, setBlockedLink] = useState(['']);
  const [exceptionLinks, setExceptionLinks] = useState(['']);
  const [categoryButtons, setCategoryButtons] = useState(['']);

  useEffect(() => {
    if (links.length && link) {
      console.log(links, link);
      for (let i = 0; i < links.length; i++) {
        if (links[i].blockedLinks[0] === link) {
          console.log(links[i], 'theONE', link);
          setBlockedLink(links[i].blockedLinks);
          setExceptionLinks(links[i].exceptionLinks);
          setCategoryButtons(links[i].categories);
        }
      }
    }
  }, [links]);

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

  function handleEdit(e) {
    const id = nanoid();
    e.preventDefault();
    if (categoryButtons) {
      if (links && links.length) {

        let updatedLinks = [];
        links.forEach(selectedLinks => {
          if(selectedLinks.blockedLinks[0] == link) {
            const updatedLink = {
              id: selectedLinks.id,
              blockedLinks: blockedLink,
              exceptionLinks: exceptionLinks,
              categories: categories
            }
            updatedLinks.push(updatedLink);
          } else if(selectedLinks.blockedLinks[0] !== link) {
            updatedLinks.push(selectedLinks)
          }
        })
        console.log(updatedLinks, 'updatedLinks');
        setLinks(updatedLinks)

      } else {
        console.log('no link');
      }

      let updatedCategories = categories.map(categoryData => {
        console.log('alo1', categoryData);
        let idk = categoryButtons.map(title => {
          //
          let temp;
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
            temp = newCategory;
            return newCategory;
          } else if (temp && temp.title !== title) {
            console.log('alo2', categoryButtons);
            return categoryData;
          }
        });
        idk = idk.filter(x => x !== undefined);
        console.log('idk', idk[0]);
                console.log('linkButton')

        return idk[0];
      });
      console.log(updatedCategories, 'updatedCategories');
      setBlockedLink(['', '']);
      setExceptionLinks(['', '']);
      setCategories(updatedCategories);
      setIsLinkModalOpen(false);
    }
  }
  function deleteLink(link) {
    handleDeleteLink(link);
  }

  return (
    <div>
      {isLinkModalOpen ? (
        <div className={showHideClassName}>
          <form onSubmit={handleEdit} className="modal-main" ref={modalRef}>
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
                        value={c}
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
                        value={c}
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
              <button
                className="margin-buttons"
                onClick={handleAddExceptionLink}
              >
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
              <button
                className="margin-buttons"
                id="submit-button"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <div className="link-div">
        <span onClick={() => handleOpenLinkModal(link)}>{link}</span>
        <ThemeIcon
          variant="light"
          size="md"
          color="dark"
          onClick={() => deleteLink(link)}
        >
          <Trash size={20} strokeWidth={2} />
        </ThemeIcon>
      </div>
    </div>
  );
};

export default LinkButton;
