const KEY = "comments"


const utils = (function () {
    const getUniqueId = function () {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    const addChildrenToDom = (parent, children) => {
        children.map(child => parent.appendChild(child));
    }

    return {
        getUniqueId,
        addChildrenToDom,
    }
})();

const LocalStorageUtils = {
    setItem: (key, value) =>
        localStorage.setItem(key, JSON.stringify(value))
    ,
    getItem: (key) => JSON.parse(localStorage.getItem(key))
}

const store = {
    init: (value) => {
        LocalStorageUtils.setItem(KEY, value);
        ViewController.updateView();
    },
    syncCommentsWithStore: () => {
        LocalStorageUtils.setItem(KEY, commentsFactory.getComments());
    }
}

const CommentsFactory = (_comments) => {
    let comments = _comments;

    const removeParentComment = (comment) => {
        comments.splice(comments.findIndex(c => c.id === comment.id), 1);
    }

    const removeChildComment = (comment, parentComment) => {
        parentComment.replies.splice(parentComment.replies.findIndex(reply => reply.id === comment.id), 1);
    }

    return {
        getComments: () => comments,
        getCommentObject: (id, commentText, authorName, parentCommentId = null) => ({
            id,
            commentText,
            authorName,
            replies: [],
            parentCommentId
        }),
        setComments: (_comments) => {
            comments = JSON.parse(JSON.stringify(_comments));
            store.syncCommentsWithStore(comments);
            ViewController.updateView()
        },
        addNewComment: (comment) => {
            comments.push(comment);
            store.syncCommentsWithStore();
        },
        removeComment: (comment, parentComment) => {
            Boolean(parentComment) ? removeChildComment(comment, parentComment) : removeParentComment(comment);
            store.syncCommentsWithStore();
        },
    }
}

const commentsFactory = CommentsFactory(LocalStorageUtils.getItem(KEY));


const ViewController = (function () {
    const addNewComment = () => {
        const commentText = document.getElementById("comment-input").value;
        const authorName = document.getElementById("author-input").value;
        const commentObj = commentsFactory.getCommentObject(utils.getUniqueId(), commentText, authorName);
        commentsFactory.addNewComment(commentObj)
        document.getElementById("comment-input").value = '';
        document.getElementById("author-input").value = '';
        updateView();
    }

    const handleReply = (comment, commentInputField, authorNameField) => {
        const replyObject = commentsFactory.getCommentObject(utils.getUniqueId(), commentInputField.value, authorNameField.value, comment.id);
        comment.replies.push(replyObject);
        updateView();
    }

    const getReplyView = (comment) => {
        const replyViewWrapper = document.createElement("div");
        replyViewWrapper.classList.add('hide');
        replyViewWrapper.classList.add('reply-view-wrapper');

        const commentInputField = document.createElement("input");
        commentInputField.placeholder = "write a reply";
        commentInputField.type = "text";

        const authorNameField = document.createElement("input");
        authorNameField.placeholder = "enter your name";
        authorNameField.type = "text";

        const actionButtonsWrapper = document.createElement('span');

        const submitReplyBtn = document.createElement("button");
        submitReplyBtn.innerText = "Submit";
        submitReplyBtn.classList.add('secondary-btn');

        submitReplyBtn.onclick = () => handleReply(comment, commentInputField, authorNameField)

        const cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.classList.add('secondary-btn');

        cancelBtn.onclick = () => {
            replyViewWrapper.classList.remove('visible');
            replyViewWrapper.classList.add('hide');
        }

        utils.addChildrenToDom(actionButtonsWrapper, [submitReplyBtn, cancelBtn])

        utils.addChildrenToDom(replyViewWrapper, [commentInputField, authorNameField, actionButtonsWrapper])

        return replyViewWrapper;
    }

    const handleDelete = (comment, parentComment) => {
        commentsFactory.removeComment(comment, parentComment)
    }

    const getCommentView = (comment, parentComment) => {
        const commentThreadWrapper = document.createElement('div');
        commentThreadWrapper.classList.add('comment-thread-wrapper');

        const commentWrapper = document.createElement('div');
        commentWrapper.classList.add('comment-wrapper');

        const commentDisplaySection = document.createElement('div');
        commentDisplaySection.classList.add('comment-display-section');

        const authorWrapper = document.createElement('p');
        authorWrapper.classList.add('size2')
        authorWrapper.innerText = comment.authorName;

        const commentTextWrapper = document.createElement('p');
        commentTextWrapper.innerText = comment.commentText;
        commentWrapper.classList.add('size4');

        utils.addChildrenToDom(commentDisplaySection, [authorWrapper, commentTextWrapper]);

        const btnSection = document.createElement('div');
        btnSection.classList.add('comment-btn-section')

        const replyButton = document.createElement("button");
        replyButton.classList.add('tertiary-btn');
        replyButton.innerText = "Reply";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add('tertiary-btn');
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => {
            commentThreadWrapper.remove()
            handleDelete(comment, parentComment)
        };

        utils.addChildrenToDom(btnSection, [replyButton, deleteButton]);

        const replyView = getReplyView(comment);

        replyButton.onclick = () => {
            replyView.classList.remove("hide");
            replyView.classList.add("visible");
        };

        utils.addChildrenToDom(commentWrapper, [commentDisplaySection, btnSection, replyView])

        commentThreadWrapper.appendChild(commentWrapper);

        if (comment.replies.length === 0)
            return commentThreadWrapper;

        const replySectionView = document.createElement('div');
        replySectionView.classList.add('reply-section-view')

        const commentRepliesViews = [];
        comment.replies.map(reply => commentRepliesViews.push(getCommentView(reply, comment)));

        utils.addChildrenToDom(replySectionView, commentRepliesViews);

        commentThreadWrapper.appendChild(replySectionView);

        return commentThreadWrapper;
    }

    const updateView = () => {
        const commentsList = commentsFactory.getComments().map(comment => getCommentView(comment, null));
        const commentDisplaySection = document.getElementById("comments-section");
        commentDisplaySection.innerHTML = '';
        utils.addChildrenToDom(commentDisplaySection, commentsList);
    }

    return {
        addNewComment,
        getCommentView,
        updateView
    }
})()

window.onload = () => {
    if (LocalStorageUtils.getItem(KEY) == null)
        commentsFactory.setComments([]);

    ViewController.updateView();
};
window.onunload = store.syncCommentsWithStore;
document.getElementById("add-comment-form").onsubmit = (e) => {
    e.preventDefault()
}

const dummyData = [
    {
        id: 'kl9lr6wb2nhfq2hfhdu',
        commentText: 'Any GOT fans over here??',
        authorName: 'Ashish Rawat',
        replies: [
            {
                id: 'kl9lrtlpruhsuz0al',
                commentText: "Yeah Man, it's a GEM",
                authorName: 'Abdul Sohail',
                replies: [
                    {
                        id: 'kl9lsfz6m5zf3cmw9x',
                        commentText: 'Oh, great, which season did u like the most?',
                        authorName: 'Ashish Rawat',
                        replies: [
                            {
                                id: 'kl9lushal7n660z6ld',
                                commentText: 'Obviously, the third season!',
                                authorName: 'Abdul Sohail',
                                replies: [],
                                parentCommentId: 'kl9lsfz6m5zf3cmw9x',
                            },
                        ],
                        parentCommentId: 'kl9lrtlpruhsuz0al',
                    },
                    {
                        id: 'kl9lvo9a0867lg2x921b',
                        commentText: 'Which one is you fav character?',
                        authorName: 'Ashok',
                        replies: [
                            {
                                id: 'kl9lwx33ly9vkply5j8',
                                commentText: "NO doubt it's Daenerys tragenian :P",
                                authorName: 'Abdul Sohail',
                                replies: [],
                                parentCommentId: 'kl9lvo9a0867lg2x921b',
                            },
                        ],
                        parentCommentId: 'kl9lrtlpruhsuz0al',
                    },
                ],
                parentCommentId: 'kl9lr6wb2nhfq2hfhdu',
            },
            {
                id: 'kl9lteoxnr6j8e6hi6',
                commentText: "Nah, I don't like that kind of genre!",
                authorName: 'Rupinder Singh',
                replies: [
                    {
                        id: 'kl9lxh02jawpzfpsxne',
                        commentText: 'I feel u should give it a try bro',
                        authorName: 'Ashish Rawat',
                        replies: [],
                        parentCommentId: 'kl9lteoxnr6j8e6hi6',
                    },
                ],
                parentCommentId: 'kl9lr6wb2nhfq2hfhdu',
            },
        ],
        parentCommentId: null,
    },
    {
        id: 'kl9lyfy5hr2x8w63dkg',
        commentText: 'Anyone up for a Counter Strike Game?',
        authorName: 'Abhishek Bhujel',
        replies: [],
        parentCommentId: null,
    },
]
