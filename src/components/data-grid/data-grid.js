import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [todo, setTodo] = useState(null);

  const [state, setState] = useState(false);

  const [min,setMin] = useState(0)
  const [max,setMax] = useState(50)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const renderBody = () => {
    if (state == false) {
      return (
        <React.Fragment>
          {items
            .sort((a, b) => b.id - a.id)
            .map((item, i) => {
              {
                if (item.id <= max && item.id>min) {
                  return (
                    <tr key={i}>
                      <th scope="row">{item.id}</th>
                      <td>{item.title}</td>
                      <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
                      <td>
                        <Button
                          className="btn btn-xs btn-danger"
                          onClick={() => onRemove(item.id)}
                        >
                          Sil
                        </Button>
                        <Button
                          className="btn btn-xs btn-warning"
                          onClick={() => onEdit(item)}
                        >
                          Düzenle
                        </Button>
                      </td>
                    </tr>
                  );
                }
              }
            })}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {items
            .sort((b, a) => b.id - a.id)
            .map((item, i) => {
              if(item.id <= max && item.id>min)
              {return (
                <tr key={i}>
                  <th scope="row">{item.id}</th>
                  <td>{item.title}</td>
                  <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
                  <td>
                    <Button
                      className="btn btn-xs btn-danger"
                      onClick={() => onRemove(item.id)}
                    >
                      Sil
                    </Button>
                    <Button
                      className="btn btn-xs btn-warning"
                      onClick={() => onEdit(item)}
                    >
                      Düzenle
                    </Button>
                  </td>
                </tr>
              );}
            })}
        </React.Fragment>
      );
    }
  };

  const renderTable = () => {
    return (
      <>
        <Button onClick={onAdd}>Ekle</Button>
        <Button onClick={siralaClick} className="btn btn-warning">
          Sıralama
        </Button>
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
            {renderBody()}
          </tbody>
        <React.Fragment>
          {items.map((item, i) => {
            if (i == 49 || i == 99 || i == 149 || i==199)
              return (
                <Button type="button" className="btn btn-outline-primary sayfalama"
                 data-id={++i} onClick={sayfalaClick}>
                  {i}
                </Button>
              );
          })}
        </React.Fragment>
        </table>
      </>
    );
  };

  function sayfalaClick(e){
    switch(e.target.getAttribute("data-id")){
      case "50": 
      setMin(0)
      setMax(50)
      break;
      case "100": 
      setMin(50)
      setMax(100)
      break;
      case "150": 
      setMin(100)
      setMax(150)
      break;
      case "200": 
      setMin(150)
      setMax(200)
      break; 
    }
  }
  function siralaClick() {
    if (state == false) {
      setState(true);
    } else {
      setState(false);
    }
  }
  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert("Ekleme işlemi başarıyla gerçekleşti.");
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id == id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? "Yükleniyor...." : todo ? renderEditForm() : renderTable()}</>
  );
}
