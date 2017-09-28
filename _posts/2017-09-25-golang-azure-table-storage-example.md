---
layout: post
comments: true
title: "Golang Fetch Azure Table Storage"
title_header: Blog
date: 2017-09-12
---

<H3>How To Fetch Data from Azure Table Storage using Golang</H3>

```go
package main

import(
	"fmt"
	"github.com/Azure/azure-sdk-for-go/storage"
)

const(
	EXAMPLE_TABLE_NAME = "MyTable"
	AZURE_STORAGE_ACCOUNT = "your-account-name"
	AZURE_STORAGE_ACCESS_KEY = "your-key"
)

func main(){
		c, err := newClient(AZURE_STORAGE_ACCOUNT,AZURE_STORAGE_ACCESS_KEY)
		if err != nil {
			fmt.Println(err)
		}
		tableService := c.GetTableService()
		table := tableService.GetTableReference(EXAMPLE_TABLE_NAME)

		entity := table.GetEntityReference("partition_key_name", "some_row_key")

		err := entity.Get(30, storage.FullMetadata, &storage.GetEntityOptions{
		Select: []string{
			"some_row_property",
		}})

		if err != nil {
			fmt.Println(err)
		}

		result := entity.Properties["some_row_property"].(string)
		fmt.Println(result)
}

func newClient(name, key string) (*storage.Client, error) {
	client, err := storage.NewBasicClient(name, key)
	if err != nil {
		return nil, err
	}
	return &client, err
}
```
