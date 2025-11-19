<script>
    import { onMount } from "svelte";
    import { availableTreesStore } from '$lib/stores/taskStore';

    let completedTasks = 0;
    let streak = 0;
    let availableTrees = 0;

    let hasTree = false;
    let forest = [];
    let nextId = 1;

    // Subscribe to the store
    availableTreesStore.subscribe(value => {
        availableTrees = value;
    });

    function plantTree() {
        if (availableTrees <= 0) {
            alert("Complete more tasks to plant trees! 🌱");
            return;
        }
        
        forest = [...forest, { id: nextId++, size: randomSize() }];
        availableTreesStore.decrement();
        saveForest();
    }

    function randomSize() {
        return 60 + Math.floor(Math.random() * 80);
    }

    function saveForest() {
        localStorage.setItem("forest_list", JSON.stringify(forest));
        localStorage.setItem("nextId", JSON.stringify(nextId));
    }

    function loadForest() {
        const saved = localStorage.getItem("forest_list");
        if (saved) forest = JSON.parse(saved);
        
        const savedId = localStorage.getItem("nextId");
        if (savedId) nextId = JSON.parse(savedId);
    }

    onMount(() => {
        loadForest();
        availableTreesStore.load();
        
        const saved = JSON.parse(localStorage.getItem("forestData"));
        if (saved) {
            completedTasks = saved.completedTasks;
            streak = saved.streak;
            hasTree = saved.completedTasks > 0;
        }
    });

    function save() {
        localStorage.setItem(
            "forestData",
            JSON.stringify({
                completedTasks,
                streak
            })
        );
    }

    export function taskCompleted() {
        completedTasks++;
        hasTree = true;

        const today = new Date().toLocaleDateString();
        const last = localStorage.getItem("lastCompletionDay");

        if (today !== last) {
            streak++;
            localStorage.setItem("lastCompletionDay", today);
        }

        save();
    }

    function treeSize() {
        return Math.min(200, 50 + completedTasks * 10);
    }
</script>

<div class="forest-container">
    <h1>Your Forest</h1>

    <div class="tree-counter">
        <div class="counter-label">Available Trees to Plant:</div>
        <div class="counter-value" class:zero={availableTrees === 0}>
            {availableTrees}
        </div>
    </div>

    <button 
        class="plant-tree-btn" 
        on:click={plantTree}
        disabled={availableTrees <= 0}
    >
        {availableTrees > 0 ? '🌱 Plant a Tree' : '🔒 Complete Tasks to Unlock'}
    </button>

    {#if forest.length === 0}
        <p class="placeholder">
            You have no trees yet.<br>
            Complete tasks on the board to earn trees! 🌳
        </p>
    {:else}
        <div class="forest-grid">
            {#each forest as t}
                <svg width={t.size} height={t.size} viewBox="0 0 100 100">
                    <circle cx="50" cy="40" r="30" fill="green" />
                    <rect x="45" y="40" width="10" height="50" fill="brown" />
                </svg>
            {/each}
        </div>
    {/if}

    {#if hasTree}
        <div style="margin-top: 30px;">
            <p><strong>Completed Tasks:</strong> {completedTasks}</p>
            <p><strong>Streak:</strong> {streak} days</p>
        </div>

        <svg class="tree" width="{treeSize()}" height="{treeSize()}" viewBox="0 0 100 100">
            <circle cx="50" cy="40" r="30" fill="green" />
            <rect x="45" y="40" width="10" height="50" fill="brown" />
        </svg>
    {/if}
</div>

<style>
    .forest-container {
        padding: 20px;
    }

    .tree-counter {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f0f0f0;
        border-radius: 10px;
    }

    .counter-label {
        font-weight: 600;
        font-size: 16px;
        color: #333;
    }

    .counter-value {
        font-size: 32px;
        font-weight: bold;
        color: #4CAF50;
        min-width: 50px;
        text-align: center;
    }

    .counter-value.zero {
        color: #999;
    }

    .plant-tree-btn {
        padding: 12px 24px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 600;
        transition: all 0.2s;
    }

    .plant-tree-btn:hover:not(:disabled) {
        background: #45a049;
        transform: scale(1.05);
    }

    .plant-tree-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
    }

    .placeholder {
        color: #666;
        font-style: italic;
        text-align: center;
        padding: 40px;
        font-size: 16px;
    }

    .tree {
        margin: 20px 0;
    }

    .forest-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 30px;
        padding: 20px;
        background: #f0f0f0;
        border-radius: 10px;
    }
</style>