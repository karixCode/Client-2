Vue.component('task-component', {
    props: {
        task: {
            type: Object,
            required: true
        },
        taskIndex: {
            type: Number,
            required: true
        }
    },
    template: `
        <li>
            <label>
                <input type="checkbox" v-model="task.completed" @change="$emit('task-updated', taskIndex)">
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
        },
        cardIndex: {
            type: Number,
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
                    :task="task"
                    :taskIndex="index"
                    @task-updated="(taskIndex) => $emit('task-updated', cardIndex, taskIndex)">
                </task-component>
            </ul>
            <button v-if="!card.completedAt && card.tasks.length < 5" @click="addTask">Добавить пункт</button>
            <p v-if="card.completedAt">Завершено: {{ card.completedAt }}</p>
        </div>
    `,
    methods: {
        addTask() {
            const text = prompt('Введите задачу')
            if (!text) return
            this.$emit('add-task', this.cardIndex, text)
        }
    }
})

Vue.component('column-component', {
    props: {
        column: {
            type: Object,
            required: true
        },
        columnIndex: {
            type: Number,
            required: true
        }
    },
    template: `
        <div class="column">
            <h2>{{ column.title }}({{column.cards.length}})</h2>
            <card-component 
                v-for="(card, index) in column.cards"
                :key="index"
                :card="card"
                :cardIndex="index"
                @add-task="(cardIndex, text) => $emit('add-task', columnIndex, cardIndex, text)"
                @task-updated="(cardIndex, taskIndex) => $emit('task-updated', columnIndex, cardIndex, taskIndex)">
            </card-component>
            <button v-if="columnIndex === 0 && column.cards.length < 3" @click="$emit('add-card', columnIndex)">Добавить карточку</button>
        </div>
    `
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
                                { text: "Task 2", completed: true },
                                { text: "Task 2", completed: true },
                                { text: "Task 2", completed: true },
                                { text: "Task 2", completed: true },
                            ]
                        },
                        {
                            title: "Card 2",
                            tasks: [
                                { text: "Task 3", completed: false },
                                { text: "Task 4", completed: false },
                                { text: "Task 4", completed: false },
                                { text: "Task 4", completed: false },
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
    },
    methods: {
        addCard(columnIndex) {
            const title = prompt('Введите название карточки')
            if (!title) return

            const tasks = []

            for (let i = 0; i < 3; i++) {
                tasks[i] = {
                    text: prompt(`Введите название задачи ${i+1}`),
                    completed: false,
                }

                if (!tasks[i].text) return

            }

            this.columns[columnIndex].cards.push({
                title,
                tasks,
                completedAt: null
            })
        },
        addTask(columnIndex, cardIndex, text) {
            this.columns[columnIndex].cards[cardIndex].tasks.push({text, completed: false})
        },
        updateTaskStatus(columnIndex, cardIndex, taskIndex) {
            this.updateColumns(columnIndex, cardIndex)

        },
        updateColumns(columnIndex, cardIndex,) {

            const tasks = this.columns[columnIndex].cards[cardIndex].tasks
            const completedTasks = tasks.filter(item => item.completed)
            const progress = completedTasks.length / tasks.length

            if (columnIndex === 0 && progress > 0.5 && this.columns[1].cards.length < 5) this.moveCard(columnIndex, cardIndex, 1)
            if (progress >= 1) this.moveCard(columnIndex, cardIndex, 2)
        },
        moveCard(columnIndex, cardIndex, toIndex) {
            const [card] = this.columns[columnIndex].cards.splice(cardIndex, 1)
            if (toIndex === 2) card.completedAt = new Date().toLocaleString();
            this.columns[toIndex].cards.push(card)
        }
    }
});


