const KEY = "comments"

const getUniqueId = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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
    syncCommentsWithStore: (comments) => {
        LocalStorageUtils.setItem(KEY, comments);
    }
}

const CommentsFactory = (_comments) => {
    let comments = _comments;

    return {
        getComments: () => JSON.parse(JSON.stringify(comments)),
        getCommentObject: (id, commentText, authorName) => ({
            id,
            commentText,
            authorName,
            replies: []
        }),
        setComments: (_comments) => {
            comments = _comments;
            store.syncCommentsWithStore(comments);
            ViewController.updateView()
        },
        addNewComment: (comment) => {
            comments.push(comment);
            store.syncCommentsWithStore(comments);
        }
    }
}

const commentsFactory = CommentsFactory(LocalStorageUtils.getItem(KEY));


const ViewController = (function () {
    const addNewComment = () => {
        const commentText = document.getElementById("comment-input").value;
        const authorName = document.getElementById("author-input").value;
        let commentObj = commentsFactory.getCommentObject(getUniqueId(), commentText, authorName);

        commentsFactory.addNewComment(commentObj)
        updateView();
    }

    const getCommentView = (comment) => {
        const commentWrapper = document.createElement('div');
        const textWrapper = document.createElement('p');
        commentWrapper.innerText = comment.commentText;

        const authorWrapper = document.createElement('p');
        authorWrapper.innerText = comment.authorName;

        commentWrapper.appendChild(textWrapper);
        commentWrapper.appendChild(authorWrapper);
        commentWrapper.appendChild(replyButton);

        commentWrapper.onclick = () => onClickHandler(comment);
        return commentWrapper;
    }

    const updateView = () => {
        const commentsList = commentsFactory.getComments().map(comment => getCommentView(comment));
        const commentDisplaySection = document.getElementById("comment-display-section");
        commentDisplaySection.innerHTML = ''
        commentsList.map(commentView => commentDisplaySection.appendChild(commentView));
    }

    return {
        addNewComment,
        getCommentView,
        updateView
    }
})()

const onClickHandler = (comment) => {
    console.log("===", comment)
    comment.authorName = "xxxxxxxxxx"
}

window.onload = ViewController.updateView;
document.getElementById("add-comment-form").onsubmit = (e) => {
    e.preventDefault()
}

