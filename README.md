# Create a JavaScript Action

A JavaScript Diff github action that print the diff between two files and create
a Diff log in the project root.

## Usage

The only thing you have to do is to convert both files contents in base64.

Here's an example :

```yaml
- name: Run diff action
  uses: Sousfiane/diff@v1.3
  with:
    old_file: <old_file content in base64>
    new_file: <new_file content in base64>
```
