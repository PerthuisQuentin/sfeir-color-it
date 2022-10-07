# SFEIR ColorIT

https://www.sfeir.com/fr/battle-algo/

## Use with direct output

```
node index.js -i path/to/input.csv
```

It will output the result directly

### Example:

```
node index.js -i ./inputs/input1.csv
```

It will output :

```
0
2
0
1
```

---

## Use with file output

```
node index.js -i path/to/input.csv -o path/to/ouput.csv
```

It will output the result directly

### Example:

```
node index.js -i ./inputs/input1.csv -o ouput.csv
```

It will create a output.csv file that contains :

```
0
2
0
1
```

---

## Debug

```
node index.js -i path/to/input.csv -d
```

It will output some additional informations :

```
1,2,0,0
0,1,1,0
2,2,0,1
0,0,0,1

Apply color 0
0,2,0,0
0,1,1,0
2,2,0,1
0,0,0,1

Apply color 2
2,2,0,0
2,1,1,0
2,2,0,1
0,0,0,1

Apply color 0
0,0,0,0
0,1,1,0
0,0,0,1
0,0,0,1

Apply color 1
1,1,1,1
1,1,1,1
1,1,1,1
1,1,1,1

Took 0.002086794 seconds
0
2
0
1
```