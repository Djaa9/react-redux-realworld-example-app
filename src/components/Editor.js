import ListErrors from './ListErrors';
import React, { useEffect } from 'react';
import agent from '../agent';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const Editor = ({match}) => {
  const dispatch = useDispatch();
  const { title, description, body, tagList, articleSlug, errors, tagInput, inProgress } = useSelector((state) => state.editor);

  const onUpdateField = (key, value) => { dispatch({ type: UPDATE_FIELD_EDITOR, key, value })} 
  
  const changeTitle = (value) => { onUpdateField('title', value)};
  const changeDescription = (value) => { onUpdateField('description', value)};
  const changeBody = (value) => { onUpdateField('body', value)};
  const changeTagInput = (value) => { onUpdateField('tagInput', value)};
  
  const onAddTag = () => { dispatch({ type: ADD_TAG }) };
  const onLoad = (payload) => { dispatch({ type: EDITOR_PAGE_LOADED, payload }) };
  const onRemoveTag = (tag) => { dispatch({ type: REMOVE_TAG, tag })};
  const onSubmit = (payload) => { dispatch({ type: ARTICLE_SUBMITTED, payload }) };
  const onUnload = () => { dispatch({ type: EDITOR_PAGE_UNLOADED }) };

  useEffect(() => {
    if(match.params.slug)
      onLoad(agent.Articles.get(match.params.slug))
    else {
      onLoad(null);
    }

    return () => onUnload();
  },[match])

  const watchForEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAddTag();
      }
    };

  const submitForm = (e) => {
      e.preventDefault();
      const article = {
        title,
        description,
        body,
        tagList
      };

      const slug = { slug: articleSlug };
      const promise = articleSlug ?
        agent.Articles.update(Object.assign(article, slug)) :
        agent.Articles.create(article);

      onSubmit(promise);
    };

    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={title}
                      onChange={(e) => changeTitle(e.target.value)} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={(e) => changeDescription(e.target.value)} />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={(e) => changeBody(e.target.value)}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={tagInput}
                      onChange={(e) => changeTagInput(e.target.value)}
                      onKeyUp={watchForEnter} />

                    <div className="tag-list">
                      {
                        (tagList || []).map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i  className="ion-close-round"
                                  onClick={() => onRemoveTag(tag)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={inProgress}
                    onClick={submitForm}>
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }

  export default Editor;
