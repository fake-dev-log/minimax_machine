# 최대최소 탐색을 활용한 삼목게임(tic-tac-toe)

## Version 1. 기본 최대최소 탐색 트리

### 1. 조건

1. 사람과 AI가 번갈아가며 삼목 게임을 플레이한다. 순서는 임의적으로 결정된다.
2. AI는 승리시 양의 무한대, 패배시 음의 무한대, 무승부시 0의 점수를 얻는다.

### 2. 알고리즘 개요

1. 깊이 우선 탐색(DFS)을 기반으로 가능한 상태를 모두 탐색한다.
2. AI의 차례가 됐을 때, 승리시 최대 보상, 패배시 최소 보상을 얻으므로, 탐색을 통해 최대 보상을 얻게 해주는 수를 선택한다.
3. 단, 상대 역시 자신의 보상을 최대화하려 하므로, AI의 보상을 최소화 하는 착수를 한다. 따라서 후계 노드는 최소 탐색에 의해 결정된다.
4. 그 최소 탐색에서 결정되는 노드는 다시 AI의 관점에서 최대 탐색에 의해 결정되며 이 과정은 게임이 종료되거나, 최대 탐색 깊이 제한에 닿을 때까지 반복된다.

### 3. 구현

#### 1. evaluate 함수

게임이 종료되지 않은 경우 수행되는 평가 함수이다.

X 또는 O가 승리조건을 만족 할 수 있는 줄에 대해 같은 가중치로 점수를 평가한다.

(하지만 이 경우 X가 두개 놓인 줄과 X가 하나 놓인 줄이 같은 점수로 계산되는 문제가 있다. 추후에 수정할 필요가 있다.)

```typescript
function evaluate(isAIFirst: boolean, currentState: State[]): number {
    let possibleX = 0;
    let possibleO = 0;
    LINES.forEach(line => {
        const stateSet = new Set();
        line.forEach(idx => {
            const state = currentState[idx];
            if (state) stateSet.add(state);
        })
        
        if (stateSet.size !== 1) return;
        
        if (stateSet.has('O')) possibleO++;
        else possibleX++;
    })

    return isAIFirst ? possibleX - possibleO : possibleO - possibleX;
}

// 승리 조건
const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
```

다만 기본적으로 탐색 깊이 제한을 9로 두었기 때문에 실제로 수행되지는 않는다.

#### 2. 최소탐색 함수

최대 깊이 제한에 닿을 경우 평가함수를 수행하고 종료한다.

그 외에는 게임의 종료 여부를 판단하고, 결과에 따라 점수를 반환한다.

게임이 끝나지 않은 경우에는 상대방의 입장에서 AI의 보상 최대화 탐색을 고려한 최소 점수 탐색을 수행한다.

```typescript
function minimize(isAIFirst: boolean, currentState: State[], depth: number): number {
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    const aiPlayer = isAIFirst ? 'X' : 'O';
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);

    if (winner === aiPlayer) {
        return Infinity;
    } else if (isDraw) {
        return 0;
    } else if (winner !== null && winner !== aiPlayer) {
        return -Infinity;
    }

    const humanPlayer = isAIFirst ? 'O' : 'X';
    let minValue = Infinity;

    // 현재 상태로부터 가능 상태를 판단한다.
    currentState.forEach((state, idx) => {

        // 빈 칸에
        if (state === null) {
            const possibleMove = currentState.slice();

            // 내(사람)가 착수를 했을 때,
            possibleMove[idx] = humanPlayer;

            // 상대방(AI)이 자신의 보상을 극대화 하는 결정중에서
            const value = maximize(isAIFirst, possibleMove, depth + 1);

            // 가장 작은 점수를 찾아 그 값을 선택한다.
            if (value < minValue) {
                minValue = value;
            }
        }
    })

    return minValue;
}
```
#### 3. 최대탐색 함수

최대 탐색 함수는 최소 탐색함수와 같으나, AI의 입장에서 상대(사람)의 보상 최대화(AI의 보상 최소화) 탐색을 고려하여 최대 탐색을 수행한다.

```typescript
function maximize(isAIFirst: boolean, currentState: State[], depth: number): number {
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    const aiPlayer = isAIFirst ? 'X' : 'O';
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);

    if (winner === aiPlayer) {
        return Infinity;
    } else if (isDraw) {
        return 0;
    } else if (winner !== null && winner !== aiPlayer) {
        return -Infinity;
    }

    let maxValue = -Infinity;

    // 마찬가지로 현재 상태로부터 가능 상태를 탐색한다.
    currentState.forEach((state, idx) => {

        // 빈칸에
        if (state === null) {
           const possibleMove = currentState.slice();

           // 내(AI)가 착수했을 때,
            possibleMove[idx] = aiPlayer;

            // 상대(사람)가 나의 점수를 최소화(상대의 점수 최대화)하는 선택을 고려하여
            const value = minimize(isAIFirst, possibleMove, depth + 1);

            // 가장 큰 보상을 택한다.
            if (value > maxValue) {
                maxValue = value;
            }
        }
    })

    return maxValue;
}
```

#### 4. 탐색함수

AI의 입장에서 상대(사람)의 최소화 탐색을 고려한 최대 탐색을 수행한다.

```typescript
export function minmax(isAIFirst: boolean, currentState: State[]): number {
    const aiPlayer = isAIFirst ? 'X' : 'O';
    let maxValue = -Infinity;
    let bestMove = 0;

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = aiPlayer;
            const value = minimize(isAIFirst, possibleMove, 1);
            if (value > maxValue) {
                maxValue = value;
                bestMove = idx;
            }
        }
    })

    return bestMove;
}
```

