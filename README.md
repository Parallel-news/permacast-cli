## Permacast V3 CLI

CLI library for uploading content to [Permacast](https://permacast.dev).

## Install
```console
npm install permacast-cli
```

## Commands

### 1- Login aka Save a keyfile

Invoking this command is required first of all to be able to invoke any other command in the CLI.
```console
permacast save-keyfile --key-file PATH-TO-YOUR-JWK-FILE.json
```

### 2- Signout aka Delete the saved keyfile

Use this command to delete your current keyfile to signout or if you want to replace it with a new one (then invoke command #1)
```console
permacast delete-keyfile
```

### 3- Import your podcast from an RSS to Permacast

Use this command to import your podcast's content from a valid RSS endpoint to your podcast over Permacast

```console
permacast import-rss --pid YOUR_PODCAST_ID --rss-url THE_RSS_URL
```

#### Example:

```console
permacast import-rss --pid IKsjaUBJiKNDtLPIOyobkUM6iPtTKAK2bMDBu30KdmE --rss-url https://terraspaces.org/feed/podcast/
```

To know how to retrieve your `pid` (podcast ID) from the Permacast FE, check this [image](https://github.com/Parallel-news/permacast-docs/blob/main/img/fid-pid.png).

### 4- View account stats

This command displays your Arweave wallet address, balance, and how many megabytes your can upload to Arweave (excluding Permacast fee multiplier)

```console
permacast account
```

## License
This project is licensed under the [MIT license](./LICENSE).
