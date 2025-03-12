Vue.component('task-component', {
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    template: `
        <li>
            <label>
                <input type="checkbox" v-model="task.completed">
                {{ task.text }}
            </label>
        </li>
    `
});


Vue.component('card-component', {
    props: {
        card: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="card">
            <h3>{{ card.title }}</h3>
            <ul>
            
                <task-component
                    v-for="(task, index) in card.tasks"
                    :key="index"
                    :task="task">
                </task-component>
            </ul>
            <button>Добавить пункт</button>
        </div>
    `,
})

Vue.component('column-component', {
    props: {
        column: {
            type: Object,
            required: true
        },
    },
    template: `
        <div class="column">
            <h2>{{ column.title }}</h2>
            <card-component 
                v-for="(card, index) in column.cards"
                :key="index"
                :card="card">
            </card-component>
            <button 
                Добавить карточку
            </button>
        </div>
    `,
})

new Vue({
    el: '#app',
    data() {
        return {
            columns: [
                {
                    title: "Новые",
                    cards: [
                        {
                            title: "Card 1",
                            tasks: [
                                { text: "Task 1", completed: false },
                                { text: "Task 2", completed: true }
                            ]
                        },
                        {
                            title: "Card 2",
                            tasks: [
                                { text: "Task 3", completed: false },
                                { text: "Task 4", completed: false }
                            ]
                        }
                    ]
                },
                {
                    title: "В процессе",
                    cards: [
                        {
                            title: "Card 3",
                            tasks: [
                                { text: "Task 5", completed: false },
                                { text: "Task 6", completed: true }
                            ]
                        }
                    ]
                },
                {
                    title: "Завершенные",
                    cards: [
                        {
                            title: "Card 4",
                            tasks: [
                                { text: "Task 7", completed: true },
                                { text: "Task 8", completed: true }
                            ]
                        }
                    ]
                }
            ]
        };
    }
});


