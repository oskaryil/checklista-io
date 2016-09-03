
if(typeof(Storage) !== "undefined") {
  // code for localstorage/sessionstorage
  console.log("Local storage is available");
} else {
  //Sorry! No web Storage
  console.log("Your browser does not support localStorage");
}

var TodoListApp = React.createClass({
getInitialState: function() {
  return ({data: [] || localStorage.getItem('data')});
},
loadItemsFromServer: function() {
  if(localStorage.getItem('data') !== null) {

    this.setState({data: JSON.parse(localStorage.getItem('data'))});
  } else if(localStorage.getItem('data') === null) {

    localStorage.setItem('data', JSON.stringify([]));
    this.setState({data: JSON.parse(localStorage.getItem('data'))});
  }

  // this.setState({data: localStorage.setItem('data', JSON.stringify('[{}]'))});

},
componentDidMount: function() {
  // this.loadItemsFsromServer();
  setInterval(this.loadItemsFromServer(), this.props.pollInterval);
  console.log(localStorage.getItem('data'));
},
handleItemSubmit: function(todoItem) {
  var todoItems = this.state.data;
  todoItem.id = Date.now();
  todoItem.date = moment().format("MMM Do YY");
  todoItem.checked = false;
  var newItems = todoItems.concat([todoItem]);
  this.setState({data: todoItems});
  localStorage.setItem('data', JSON.stringify(newItems));
  this.setState({data: JSON.parse(localStorage.getItem('data'))});
  console.log(JSON.parse(localStorage.getItem('data')));
},

clearItems: function() {
  localStorage.setItem('data', '[]');
  this.state.data = '[]';
},

render: function() {
  return(
      <div id="todoList" className="center-block">
        <h1 className="text-center heading">Checklista</h1>
        <TodoListItems data={this.state.data} />
        <TodoListForm onItemSubmit={this.handleItemSubmit} />
        <button onClick={this.clearItems} className="btn btn-danger">Clear All</button>
      </div>
  );
}
});

var TodoListItems = React.createClass({
render: function() {
  var todoNodes = this.props.data.map(function(todoItem) {
    return(
        <TodoItem key={todoItem.id} uid={todoItem.id} date={todoItem.date} checked={todoItem.checked}>
          {todoItem.text}
        </TodoItem>
    );
  });
  return(
    <div className="todoList">
      <ul className="text-center">
        {todoNodes}
      </ul>
    </div>
  );
}
});

var TodoItem = React.createClass({

// getInitialState: function() {
//   return null;
// },

componentDidMount: function() {
  var data = JSON.parse(localStorage.getItem('data'));
  data.forEach(function(item){
    if(item.checked) {
      $("label[for='" + item.id.toString()+"']").addClass('line-through');
      $("#"+item.id.toString()).prop("checked", true);
    } else {
      // $("label[for='" + item.id.toString()+"']").removeClass('line-through');
      $("#"+item.id.toString()).prop("checked", false);

    }
  });
},

handleCheckedd: function(e) {
  // if($('.todo-text').innerHTML === this.props.children.toString()) {
  //   console.log('works');
  // }
  // $('.todo-text').toggleClass('line-through');
  // var data = this.props.data;
  // data[this.props.key].checked = true;


  // $("input:checkbox").change(
  // function(){
  //     if ($(this).is(':checked')) {
  //       var labelFor = $("label[for='"+uid+"'");
  //       console.log(labelFor);
  //       labelFor.toggleClass('line-through');
  //     }
  // });

  // if(checked) {
  //   console.log("hello");
  // }
  // var labels = document.getElementsByTagName('LABEL');
  // for(var i = 0; i < labels.length; i++) {
  //   if(labels[i].htmlFor != '') {
  //     var elem = document.getElementById(labels[i].htmlFor);
  //     if(elem) {
  //       elem.label = labels[i];
  //       console.log(elem.label);
  //       // document.getElementsByClassName('checkBox').label.innerHTML = "hello world";
  //     }
  //   }
  // }
  var label = $("label[for='"+e.target.id+"']");
  this.setState({label: label});

  var data = JSON.parse(localStorage.getItem('data'));
  data.forEach(function(item) {
    if(item.id === parseInt(e.target.id)) {

      if(e.target.checked) {
        item.checked = true;
        $("label[for='"+e.target.id+"']").addClass("line-through");
      } else {
        item.checked = false;
        $("label[for='"+e.target.id+"']").removeClass("line-through");

      }
    }
  });

  localStorage.setItem('data', JSON.stringify(data));
},

// getInitialState: function() {
//   return ({label: null});
// },

// componentDidMount: function() {
//     if(this.props.checked) {
//     this.state.label.addClass('line-through');
//   } else {
//     this.state.label.removeClass('line-through');
//   }

// },

render: function() {


  return(
    <div className="row">
      <div className="col-md-12">
        <li className="todoItem">
          <div className="checkbox checkbox-circle checkBox">
            <input id={this.props.uid.toString()} onChange={this.handleCheckedd} className="styled" type="checkbox" />
            <label htmlFor={this.props.uid.toString()}>{this.props.children.toString()}</label>
          </div>
              {/*<p className="todo-text">{this.props.children.toString()}</p>*/}
              <i className="fa fa-pdencil edit-pencil"></i>
              <em>{this.props.date}</em>
        </li>
      </div>
    </div>
  );
}
});

var TodoListForm = React.createClass({
getInitialState: function() {
  return {text: ''};
},
handleTextChange: function(e) {
  this.setState({text: e.target.value});
},
handleSubmit: function(e) {
  e.preventDefault();
  var text = this.state.text.trim();
  if(!text) {
    return;
  }
  $('#taskInput').css('border-color', '#18BC9C');
  this.props.onItemSubmit({text: text});
  this.setState({text: ''});
},
render: function() {
  return (
    <form className="todoForm" onSubmit={this.handleSubmit}>
      <div className="form-group">
        <div className="input-group">
          <input id="taskInput" className="form-control" type="text" placeholder="Task" value={this.state.text} onChange={this.handleTextChange} />
          <span className="input-group-btn">
            <input className="btn btn-success" type="submit" value="Add" />
          </span>
        </div>
      </div>
    </form>
  );
}
});

ReactDOM.render(
<TodoListApp url="/api/comments" pollInterval={2000} />,
document.getElementById('content')
);
