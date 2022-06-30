import React from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"

export class DataGridClsComponent extends React.Component {

  state = {
    loading: false,
    items: [],
    todo: null,
    siralama: false,
    min : 0,
    max : 50
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ loading: true })
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        this.setState({ items: response, loading: false })
    }).catch(e => {
      this.setState({ loading: false })
    })
  }

  renderBody = () => {
    if(this.state.siralama == false){return (
      <React.Fragment>
        {this.state.items.sort((a, b) => b.id - a.id).map((item, i) => {
           if(item.id <= this.state.max && item.id >this.state.min)
          {return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => this.onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => this.onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )}
        })}
      </React.Fragment>
    )}else{
      return (
        <React.Fragment>
          {this.state.items.sort((b, a) => b.id - a.id).map((item, i) => {
            if(item.id <= this.state.max && item.id >this.state.min)
            {return (
              <tr key={i}>
                <th scope="row" >{item.id}</th>
                <td>{item.title}</td>
                <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
                <td>
                  <Button className="btn btn-xs btn-danger" onClick={() => this.onRemove(item.id)}>Sil</Button>
                  <Button className="btn btn-xs btn-warning" onClick={() => this.onEdit(item)}>Düzenle</Button>
                </td>
              </tr>
            )}
          })}
        </React.Fragment>
      )
    }
  }

  renderTable = () => {
    return (
      <>
        <Button onClick={this.onAdd}>Ekle</Button>
        <Button onClick={this.sirala} className="btn btn-warning">Sıralama</Button>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Başlık</th>
              <th scope="col">Durum</th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
          <React.Fragment>
          {this.state.items.map((item, i) => {
            if (i == 49 || i == 99 || i == 149 || i==199)
              return (
                <Button type="button" className="btn btn-outline-primary sayfalama"
                 data-id={++i} onClick={this.sayfalaClick}>
                  {i}
                </Button>
              );
          })}
        </React.Fragment>
        </table>
    </>
    )
  }

  sayfalaClick = (e) => {
    switch(e.target.getAttribute("data-id")){
      case "50": 
      this.setState({min: 0})
      this.setState({max: 50})
      break;
      case "100": 
      this.setState({min: 50})
      this.setState({max: 100})
      break;
      case "150": 
      this.setState({min: 100})
      this.setState({max: 150})
      break;
      case "200": 
      this.setState({min: 150})
      this.setState({max: 200})
      break; 
    }
  }

  sirala = () => {
    if(this.state.siralama == false){
      this.setState({siralama: true})
    }else{
      this.setState({siralama: false})
    }
  }
  saveChanges = () => {
    // insert
    const { todo, items } = this.state
    if (todo && todo.id === -1) {

      todo.id = Math.max(...items.map(x => x.id)) + 1
      items.push(todo)
      this.setState({ items, todo: null })
      alert("Ekleme işlemi başarıyla gerçekleşti.")
      return
    }
    // update
    const index = items.findIndex(item => item.id == todo.id)
    items[index] = todo
    
    this.setState({ items, todo: null})
  }

  onAdd = () => {
    this.setState({
      todo: {
        id: -1,
        title: "",
        completed: false
      }
    })
  }

  onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const { items } = this.state
    const index = items.findIndex(item => item.id == id)
    items.splice(index, 1)
    this.setState({ items })
  }

  onEdit = (todo) => {
    this.setState({ todo })
  }

  onTitleChange = (value) => {
    const todo = this.state.todo
    todo.title = value
    this.setState({ todo })
  }

   onCompletedChange = (value) => {
    const todo = this.state.todo
    todo.completed = value
    this.setState({ todo })
  }

  renderEditForm = () => {
    const { todo } = this.state
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => this.onTitleChange(e.target.value)}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => this.onCompletedChange(e.target.checked)}
        />
        <Button onClick={this.saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={this.cancel}>Vazgeç</Button>
      </>
    )
  }

  cancel = () => {
    this.setState({ todo: null })
  }

  render() {
    const { todo, loading } = this.state
    return (
      <>
      { loading ? "Yükleniyor...." : (todo ? this.renderEditForm() : this.renderTable())}
      </>
    )
  }
}