export class Text {

    id?: number;
    text?: string;
    previous?: number;
    views?: number;
    likes?: number;
    dislikes?: number;
    createdAt?: Date;
    updateAt?: Date;
  
    constructor(
      id: number = 0, 
      text: string = "",
      previous: number = 0, 
      views: number = 0, 
      likes: number = 0, 
      dislikes: number = 0, 
    ) {
      this.id = id;
      this.text = text;
      this.previous = previous;
      this.views = views;
      this.likes = likes;
      this.dislikes = dislikes;
    }

    public static map(data): Text {

      let text: Text = new Text();

      text.id = data.id;
      text.text = data.text;
      text.previous = data.previous;
      text.views = data.views;
      text.likes = data.likes;
      text.dislikes = data.dislikes;

      return text;
    }

    public static maps(data): Text[] {

      let texts: Text[] = [];

      for (let index = 0; index < data.length; index++) {
        let t = new Text();

        t.id = data[index].id;
        t.text = data[index].text;
        t.previous = data[index].previous;
        t.views = data[index].views;
        t.likes = data[index].likes;
        t.dislikes = data[index].dislikes;

        texts.push(t);
      }
      return texts;
    }
  }