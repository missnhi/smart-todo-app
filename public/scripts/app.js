// Client facing scripts here
$(document).ready(function () {

  //Handle updating the CSS and animating the task card
  const markTaskComplete = (e) => {
    const todoDisplay = $(e).closest('.todo-item-card');
    todoDisplay.toggleClass('completed-item');

    if (todoDisplay.hasClass('completed-item')) {
      setTimeout(() => {
        $(e).closest('.todo-item').animate({
          left: "2500",
          opacity: "0"
        }, 800, "swing", function () {
          $(e).closest('.todo-item').remove();
          console.log("animation complete");
        })
      }, 250);
    }
  }

  //call markTaskComplete on btn click
  $('.todo-item button').on('click', function (e) {
    markTaskComplete(e.target);
  })


  const noHTML = (str) => {
    const regex = /\<\/?[a-z]*\>/gm;

    return str.replaceAll(regex, '');
  };

  const createTodo = (todoData) => {
    // const timeagoFormatted = timeago.format(tweetData.created_at);

    const $newTodo = $(`
      <div class="todo-item">
        <div class="todo-item-card ${todoData.complete ? 'completed-item' : ''}">
          <div class="todo-item-info">
            <button
              type="button"
              class="complete-task-btn"
              name="complete-task"
              value="complete"
            >
            <img src="../assets/checkmark.png"/>
            </button>
            <div class="todo-item-text">
              <span class="todo-item-title">${noHTML(todoData.name)}</span>
              ${todoData.due_date ? `<span class="todo-item-deadline"> ${noHTML(todoData.due_date)} </span>` : ''}
            </div>
          </div>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    `);

    return $newTodo;
  };

  
  const renderAllTasks = (allTasks) => {
    for (const task of allTasks) {
      const $singleTask = createTodo(task);
      $('#display-tasks').append($singleTask);
    }
  };
  
  const loadTasks = () => {
    console.log(listData);
    $('#tasks').empty();
    renderAllTasks(listData);
  };

  loadTasks();

  //create a new task on form submission
  /* $('#create-tweet').on('submit', function (event) {
    event.preventDefault();

    const tweetContent = noHTML($(this).find('textarea').val().trim());
    const serializedData = $(this).serialize();

    //check that the form field actually has content before allowing it to post
    if (!tweetContent) {
      $('.tweet-warning span').text('There\'s nothing there!');
      $('.tweet-warning').css({ display: "flex", opacity: 1 });
    } else if (tweetContent.length > 140) {
      $('.tweet-warning span').text('Your Tweet is too long!');
      $('.tweet-warning').css({ display: "flex", opacity: 1 });
    } else {
      $.post('/tweets', serializedData, () => {
        $(this).find('textarea').val('');
        $('.tweet-output output').val('140');

        $('.tweet-warning').css({ opacity: 0 });

        setTimeout(function () {
          $('.tweet-warning').css({ display: "none" });
        }, 300);

        loadTweets();
      });
    }
  }); */
});