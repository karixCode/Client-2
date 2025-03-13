Vue.component('task-component', {
    props: {
        task: {
            type: Object,
            required: true
        },
        taskIndex: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    template: `
        <li>
            <label>
                <input type="checkbox" v-model="task.completed" :disabled="disabled" @change="$emit('task-updated', taskIndex)">
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
        },
        isFirstColumnBlocked: {
            type: Boolean,
            default: false
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
                    :disabled="isFirstColumnBlocked || !!card.completedAt"
                    @task-updated="(taskIndex) => $emit('task-updated', cardIndex, taskIndex)">
                </task-component>
            </ul>
            <button v-if="canAddTask" @click="addTask">Добавить пункт</button>
            <p v-if="card.completedAt">Завершено: {{ card.completedAt }}</p>
        </div>
    `,
    computed: {
        canAddTask() {
            return !this.card.completedAt && this.card.tasks.length < 5 && !this.isFirstColumnBlocked
        }
    },
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
        },
        isFirstColumnBlocked: {
            type: Boolean,
            default: false
        }
    },
    template: `
        <div class="column">
            <h2>{{ column.title }}({{column.cards.length}})</h2>
            <card-component 
                v-for="(card, index) in column.cards"
                :key="card.id"
                :card="card"
                :cardIndex="index"
                :is-first-column-blocked="isFirstColumnBlocked"
                @add-task="(cardIndex, text) => $emit('add-task', columnIndex, cardIndex, text)"
                @task-updated="(cardIndex, taskIndex) => $emit('task-updated', columnIndex, cardIndex, taskIndex)">
            </card-component>
            <button v-if="canAddCard" @click="$emit('add-card', columnIndex)">Добавить карточку</button>
        </div>
    `,
    computed: {
        canAddCard() {
            return this.columnIndex === 0 && this.column.cards.length < 3 && !this.isFirstColumnBlocked
        }
    }
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
                            id: 1,
                            title: "Card 1",
                            tasks: [
                                { text: "Task 1", completed: false },
                                { text: "Task 2", completed: false },
                                { text: "Task 2", completed: false },
                                { text: "Task 2", completed: true },
                                { text: "Task 2", completed: true },
                            ]
                        },
                        {
                            id: 2,
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
                            id: 3,
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
                    cards: []
                }
            ]
        }
    },
    computed: {
        isFirstColumnBlocked() {
            return this.columns[1].cards.length >= 5;
        },
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
                id: Date.now(),
                title,
                tasks,
                completedAt: null
            })
            this.saveData()
        },
        addTask(columnIndex, cardIndex, text) {
            this.columns[columnIndex].cards[cardIndex].tasks.push({text, completed: false})
            this.saveData()
        },
        updateTaskStatus(columnIndex, cardIndex, taskIndex) {
            this.updateColumns(columnIndex, cardIndex)
            this.saveData()
        },
        updateColumns(columnIndex, cardIndex,) {
            const tasks = this.columns[columnIndex].cards[cardIndex].tasks
            const completedTasks = tasks.filter(item => item.completed)
            const progress = completedTasks.length / tasks.length

            if (columnIndex === 0 && progress > 0.5 && this.columns[1].cards.length < 5) this.moveCard(columnIndex, cardIndex, 1)
            else if (progress === 1) this.moveCard(columnIndex, cardIndex, 2)
            this.saveData()
        },
        moveCard(columnIndex, cardIndex, toIndex) {
            const [card] = this.columns[columnIndex].cards.splice(cardIndex, 1)
            if (toIndex === 2) card.completedAt = new Date().toLocaleString();
            this.columns[toIndex].cards.push(card)
            this.saveData()
        },
        saveData() {
            localStorage.setItem("columns", JSON.stringify(this.columns));
        },
        loadData() {
            const savedData = localStorage.getItem("columns");
            if (savedData) {
                this.columns = JSON.parse(savedData);
            }
        }
    },
    mounted() {
        this.loadData();
    }
});


