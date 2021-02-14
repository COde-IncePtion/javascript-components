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

const commentMap = new Map();

const initializeMap = (comments) => {
    if (comments.length === 0)
        return;

    comments.map(comment => {
        commentMap.set(comment.id, comment);
        initializeMap(comment.replies);
    })
}

const CommentsFactory = (_comments) => {
    let comments = _comments;

    const removeParentComment = (comment) => {
        comments.splice(comments.findIndex(c => c.id === comment.id), 1);
    }

    const removeChildComment = (comment) => {
        const parentComment = commentMap.get(comment.parentCommentId)
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
            comments = _comments;
            store.syncCommentsWithStore(comments);
            ViewController.updateView()
        },
        addNewComment: (comment) => {
            commentMap.set(comment.id, comment);
            comments.push(comment);
            store.syncCommentsWithStore();
        },
        removeComment: (comment) => {
            Boolean(comment.parentCommentId) ? removeChildComment(comment) : removeParentComment(comment);
            store.syncCommentsWithStore();
        }
    }
}

const commentsFactory = CommentsFactory(LocalStorageUtils.getItem(KEY));


const ViewController = (function () {
    const addNewComment = () => {
        const commentText = document.getElementById("comment-input").value;
        const authorName = document.getElementById("author-input").value;
        const commentObj = commentsFactory.getCommentObject(utils.getUniqueId(), commentText, authorName);

        commentsFactory.addNewComment(commentObj)
        updateView();
    }

    const handleReply = (comment, commentInputField, authorNameField) => {
        const replyObject = commentsFactory.getCommentObject(utils.getUniqueId(), commentInputField.value, authorNameField.value, comment.id);
        commentMap.set(replyObject.id, replyObject);
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

    const handleDelete = (comment) => {
        commentsFactory.removeComment(comment)
        updateView();
    }

    const getCommentView = (comment) => {
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
        deleteButton.onclick = () => handleDelete(comment);

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
        comment.replies.map(reply => commentRepliesViews.push(getCommentView(reply)));

        utils.addChildrenToDom(replySectionView, commentRepliesViews);

        commentThreadWrapper.appendChild(replySectionView);

        return commentThreadWrapper;
    }

    const updateView = () => {
        const commentsList = commentsFactory.getComments().map(comment => getCommentView(comment));
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
    ViewController.updateView();
    initializeMap(commentsFactory.getComments());
};
window.onunload = store.syncCommentsWithStore;
document.getElementById("add-comment-form").onsubmit = (e) => {
    e.preventDefault()
}

