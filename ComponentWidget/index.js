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
    syncCommentsWithStore: () => {
        LocalStorageUtils.setItem(KEY, commentsFactory.getComments());
    }
}

const CommentsFactory = (_comments) => {
    let comments = _comments;

    return {
        getComments: () => comments,
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
            store.syncCommentsWithStore();
        },
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

    const getReplyView = (comment) => {
        const replyViewWrapper = document.createElement("div");

        const commentInputField = document.createElement("input");
        commentInputField.placeholder = "enter your reply here";
        commentInputField.type = "text";

        const authorNameField = document.createElement("input");
        authorNameField.placeholder = "enter your name";
        authorNameField.type = "text";

        const submitReplyBtn = document.createElement("button");
        submitReplyBtn.innerText = "submit reply";
        submitReplyBtn.onclick = () => {
            console.log(commentInputField.value, authorNameField.value)
            const replyObject = commentsFactory.getCommentObject(12, commentInputField.value, authorNameField.value)
            comment.replies.push(replyObject);
            updateView();
        }

        replyViewWrapper.appendChild(commentInputField);
        replyViewWrapper.appendChild(authorNameField);
        replyViewWrapper.appendChild(submitReplyBtn);

        replyViewWrapper.className = "hide"
        return replyViewWrapper;
    }

    const getCommentView = (comment) => {
        const commentWrapper = document.createElement('div');
        const commentTextWrapper = document.createElement('p');
        commentTextWrapper.innerText = comment.commentText;

        const authorWrapper = document.createElement('p');
        authorWrapper.innerText = comment.authorName;

        const replyButton = document.createElement("button");
        replyButton.innerText = "reply";

        const replyView = getReplyView(comment);

        replyButton.onclick = () => {
            replyView.classList.remove("hide");
            replyView.classList.add("visible");
        };

        commentWrapper.appendChild(commentTextWrapper);
        commentWrapper.appendChild(authorWrapper);
        commentWrapper.appendChild(replyButton);
        commentWrapper.appendChild(replyView);
        if(comment.replies.length===0)
            return commentWrapper;

        const commentRepliesViews =[];
        comment.replies.map(reply=> commentRepliesViews.push(getCommentView(reply)));
        commentRepliesViews.map(replyView=> commentWrapper.appendChild(replyView));
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

window.onload = ViewController.updateView;
window.onunload = store.syncCommentsWithStore;
document.getElementById("add-comment-form").onsubmit = (e) => {
    e.preventDefault()
}

